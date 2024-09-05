#!/usr/bin/env node
import { Command } from "commander";
import crypto from "crypto";
import { TextEncoder, TextDecoder, promisify } from "util";
import config from "./config.js";
import fs from "fs/promises";
import sharp from "sharp";

const API_URL = config.apiUrl;
const program = new Command();

program
  .name("secrets")
  .description("CLI tool to create your secrets")
  .version("1.0.0");

//secrets create "secret message" 3600 -i ./image2.png
program
  .command("create")
  .description("Create a secret")
  .argument("<text>", "Secret text")
  .argument("<expiry>", "Secret Duration")
  .option("-i, --images <images...>", "Secret images", [])
  .action(async (text, expiry, options) => {
    try {
      const { images } = options;
      let imageBase64Strings = [];
      if (images && images.length > 0) {
        for (const imagePath of images) {
          try {
            const fileBuffer = await fs.readFile(imagePath);
            const compressedFile = await compressImage(fileBuffer, 0.7);
            const base64String = await convertFileToBase64(compressedFile);
            imageBase64Strings.push(base64String);
          } catch (err) {
            console.error(`Error reading image file at ${imagePath}:`, err);
            throw err;
          }
        }
      }

      const combinedData = {
        text: text,
        images: imageBase64Strings,
      };
      const combinedString = JSON.stringify(combinedData);
      const encryptionKey = generatePassphrase();
      const encryptedText = await encryptData(combinedString, encryptionKey);
      const roomId = await createSecret({
        secret: encryptedText,
        expiry: Number(expiry),
      });
      let sharingUrl = `http://localhost:5173/${roomId}#${encryptionKey}`;

      console.log("Secret created!\n");
      console.log("Sharing URL: ", sharingUrl, "\n");
    } catch (error) {
      console.error("Error creating secret:", error);
    }
  });

program
  .command("reveal")
  .description("Reveal the secret")
  .argument("<text>", "Secret URL")
  .action(async (text) => {
    try {
      const room = text.split("/")[3].split("#")[0];
      const secret = await getRoomSecret(room);
      const encryptionKey = text.split("#")[1];
      let decryptedSecret = await decryptData(secret, encryptionKey);
      const parsedSecret = JSON.parse(decryptedSecret);
      let secretText = parsedSecret.text;
      console.log("Secret revealed!!\n\n");
      console.log(secretText, "\n");
    } catch (error) {
      console.error("Error revealing secret:", error);
    }
  });

program.parse(process.argv);

async function getPasswordKey(passphrase) {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.webcrypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return keyMaterial;
}

async function deriveKey(passwordKey, salt, usages) {
  return crypto.webcrypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    true,
    usages
  );
}

const base64ToBuffer = (base64) => {
  return Buffer.from(base64, "base64");
};

const bufferToBase64 = (buffer) => {
  return buffer.toString("base64");
};

function generatePassphrase() {
  return crypto.randomBytes(16).toString("hex");
}

async function encryptData(data, passphrase) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);

  const passwordKey = await getPasswordKey(passphrase);
  const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);

  const keyBuffer = Buffer.from(
    await crypto.webcrypto.subtle.exportKey("raw", aesKey)
  );

  const cipher = crypto.createCipheriv("aes-256-gcm", keyBuffer, iv);

  let encryptedContent = cipher.update(data, "utf8");
  encryptedContent = Buffer.concat([encryptedContent, cipher.final()]);

  const authTag = cipher.getAuthTag();

  const combined = Buffer.concat([salt, iv, encryptedContent, authTag]);
  return bufferToBase64(combined);
}

async function decryptData(encryptedText, passphrase) {
  try {
    const encryptedData = base64ToBuffer(encryptedText);

    const salt = encryptedData.slice(0, 16);
    const iv = encryptedData.slice(16, 28);
    const authTag = encryptedData.slice(-16);
    const encryptedContent = encryptedData.slice(28, -16);

    const passwordKey = await getPasswordKey(passphrase);
    const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);

    const keyBuffer = Buffer.from(
      await crypto.webcrypto.subtle.exportKey("raw", aesKey)
    );

    const decipher = crypto.createDecipheriv("aes-256-gcm", keyBuffer, iv);
    decipher.setAuthTag(authTag);

    let decryptedContent = decipher.update(encryptedContent);
    decryptedContent = Buffer.concat([decryptedContent, decipher.final()]);

    const decodedText = new TextDecoder().decode(decryptedContent);
    return decodedText;
  } catch (e) {
    console.error(`Decryption error: ${e}`);
    return "";
  }
}

async function createSecret({ secret, expiry }) {
  try {
    const response = await fetch(`${API_URL}/api/secrets`, {
      method: "POST",
      body: JSON.stringify({ secret, expiry }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const body = await response.json();

    if (!body.room_id) {
      throw new Error("Response JSON does not contain room_id");
    }
    return body.room_id;
  } catch (error) {
    console.error("Error in createSecret:", error);
    throw error;
  }
}

async function getRoomSecret(room) {
  try {
    const response = await fetch(`${API_URL}/api/secrets/${room}`, {
      method: "GET",
    });
    if (response.status === 404) {
      throw new Error("No such secret!");
    } else if (response.status !== 200) {
      throw new Error("Something exploded!");
    }
    const body = await response.json();
    return body.secret;
  } catch (error) {
    console.error("Error in getRoomSecret:", error);
    throw error;
  }
}

async function convertFileToBase64(fileBuffer) {
  return fileBuffer.toString('base64');
}

async function compressImage(fileBuffer, quality = 0.7) {
  try {
    const image = sharp(fileBuffer);
    const metadata = await image.metadata();

    const MAX_WIDTH = 1024;
    const scaleSize = MAX_WIDTH / metadata.width;

    if (metadata.width > MAX_WIDTH) {
      const resizedImage = await image
        .resize({
          width: MAX_WIDTH,
          height: Math.round(metadata.height * scaleSize),
        })
        .png({ quality: quality * 100 })
        .toBuffer();
      return resizedImage;
    } else {
      return await image.png({ quality: quality * 100 }).toBuffer();
    }
  } catch (error) {
    throw new Error("Image compression failed: " + error.message);
  }
}
