import CryptoJS from "crypto-js";

const enc = new TextEncoder();

async function getPasswordKey(passphrase: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return window.crypto.subtle.importKey(
    "raw",
    encoder.encode(passphrase),
    "PBKDF2",
    false,
    ["deriveKey"]
  );
}

async function deriveKey(
  passwordKey: CryptoKey,
  salt: Uint8Array,
  usages: KeyUsage[]
): Promise<CryptoKey> {
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    usages
  );
}

const base64ToBuffer = (base64: string): Uint8Array => {
  const base64String = base64.replace(/^data:.+;base64,/, "");

  const binaryString = atob(base64String);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes;
};

const bufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binaryString = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
};

export function generateRandomChars(number: number): string {
  return Array(number)
    .fill("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz")
    .map(
      (char) =>
        char[
          Math.floor(
            (crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1)) *
              char.length
          )
        ]
    )
    .join("");
}

export function generatePassphrase(): string {
  return CryptoJS.lib.WordArray.random(16).toString();
}

export async function encryptData(
  data: string,
  passphrase: string
): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));

  const passwordKey = await getPasswordKey(passphrase);
  const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);

  const encryptedContent = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    aesKey,
    new TextEncoder().encode(data)
  );

  const combined = new Uint8Array(
    salt.length + iv.length + encryptedContent.byteLength
  );
  combined.set(salt);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encryptedContent), salt.length + iv.length);

  return bufferToBase64(combined);
}

export async function decryptData(
  encryptedText: string,
  passphrase: string
): Promise<string> {
  try {
    const encryptedData = base64ToBuffer(encryptedText);

    const salt = encryptedData.slice(0, 16);
    const iv = encryptedData.slice(16, 28);
    const encryptedContent = encryptedData.slice(28);

    const passwordKey = await getPasswordKey(passphrase);

    const aesKey = await deriveKey(passwordKey, salt, ["decrypt"]);

    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      encryptedContent
    );

    const decodedText = new TextDecoder().decode(decryptedContent);
    return decodedText;
  } catch (e) {
    console.error(`Decryption error: ${e}`);
    return "";
  }
}

export function splitIntoChunks(data: string, chunkSize: number): string[] {
  const numChunks = Math.ceil(data.length / chunkSize);
  const chunks = new Array(numChunks);

  for (let i = 0, o = 0; i < numChunks; ++i, o += chunkSize) {
    chunks[i] = data.substr(o, chunkSize);
  }

  return chunks;
}

export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

export async function compressImage(
  file: File,
  options: { quality?: number }
): Promise<File> {
  const { quality = 0.7 } = options;
  return new Promise<File>((resolve, reject) => {
    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = (event) => {
      const result = event.target?.result;

      if (result) {
        const img = new Image();
        img.src = result as string;

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (ctx) {
            const MAX_WIDTH = 1024;
            const scaleSize = MAX_WIDTH / img.width;
            canvas.width = MAX_WIDTH;
            canvas.height = img.height * scaleSize;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            canvas.toBlob(
              (blob) => {
                if (blob) {
                  resolve(
                    new File([blob], file.name, {
                      type: file.type,
                      lastModified: Date.now(),
                    })
                  );
                } else {
                  reject(new Error("Image compression failed."));
                }
              },
              file.type,
              quality
            );
          } else {
            reject(new Error("Canvas context could not be created."));
          }
        };

        img.onerror = () => reject(new Error("Image loading failed."));
      } else {
        reject(new Error("FileReader result is null."));
      }
    };

    reader.onerror = () => reject(new Error("FileReader failed."));
  });
}
