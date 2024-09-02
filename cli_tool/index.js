#!/usr/bin/env node
import { Command } from "commander";
import crypto from "crypto";
import { TextEncoder, TextDecoder } from "util";
import config from "./config.js";


const API_URL = config.apiUrl;
const program = new Command();

program
  .name("secrets")
  .description("CLI tool to create your secrets")
  .version("1.0.0");

program
  .command("create")
  .description("Create a secret")
  .argument("<text>", "Secret text")
  .argument("<expiry>", "Secret Duration")
  .action(async (text, expiry) => {
    try {
      const encryptionKey = generatePassphrase();
      const encryptedText = await encryptData(text, encryptionKey);
      const roomId = await createSecret({
        secret: encryptedText,
        expiry: Number(expiry),
      });
      let sharingUrl = `http://localhost:5173/${roomId}#${encryptionKey}`;

      console.log("Secret created!\n");
      console.log("Sharing URL: ", sharingUrl, '\n');
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
      const room = text.split('/')[3].split('#')[0];
      const secret = await getRoomSecret(room);
      const encryptionKey = text.split("#")[1];
      let decryptedSecret = await decryptData(secret, encryptionKey);
      console.log("Secret revealed!!\n\n");
      console.log(decryptedSecret, '\n');
    } catch (error) {
      console.error("Error revealing secret:", error);
    }
  });

program.parse(process.argv);

function getPasswordKey(passphrase) {
  const encoder = new TextEncoder();
  return crypto.pbkdf2Sync(encoder.encode(passphrase), "", 1, 32, "sha256");
}

function deriveKey(passwordKey, salt, usages) {
  return crypto.pbkdf2Sync(passwordKey, salt, 100000, 32, "sha256");
}

function base64ToBuffer(base64) {
  const binaryString = Buffer.from(base64, "base64").toString("binary");
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
}

function bufferToBase64(buffer) {
  return Buffer.from(buffer).toString("base64");
}

function generatePassphrase() {
  return crypto.randomBytes(16).toString("hex");
}

async function encryptData(data, passphrase) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);

  const passwordKey = getPasswordKey(passphrase);
  const aesKey = deriveKey(passwordKey, salt, ["encrypt"]);

  const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);

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

    const passwordKey = getPasswordKey(passphrase);
    const aesKey = deriveKey(passwordKey, salt, ["decrypt"]);

    const decipher = crypto.createDecipheriv("aes-256-gcm", aesKey, iv);
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
    const response = await fetch(`${API_URL}/api/secrets/${room}`, { method: "GET" });
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
