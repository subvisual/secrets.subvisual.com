/**
 * Props to https://bradyjoslin.com/blog/encryption-webcrypto/
 */

const enc = new TextEncoder();

const getPasswordKey = (password: string) =>
  window.crypto.subtle.importKey("raw", enc.encode(password), "PBKDF2", false, [
    "deriveKey",
  ]);

const deriveKey = (
  passwordKey: CryptoKey,
  salt: ArrayBuffer,
  keyUsage: KeyUsage[]
) =>
  window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    keyUsage
  );

const bufferToBase64 = (buff: ArrayBuffer): string => {
  const bytes = new Uint8Array(buff);
  const binary = String.fromCharCode.apply(null, Array.from(bytes));
  return btoa(binary);
};

function base64ToBuffer(base64: string): Uint8Array {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}


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
  return generateRandomChars(32);
}

export async function encryptData(
  plainText: string,
  passphrase: string
): Promise<string> {
  try {
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const passwordKey = await getPasswordKey(passphrase);
    const aesKey = await deriveKey(passwordKey, salt, ["encrypt"]);
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv: iv,
      },
      aesKey,
      new TextEncoder().encode(plainText)
    );

    const encryptedContentArr = new Uint8Array(encryptedContent);
    const buff = new Uint8Array(
      salt.byteLength + iv.byteLength + encryptedContentArr.byteLength
    );
    buff.set(salt, 0);
    buff.set(iv, salt.byteLength);
    buff.set(encryptedContentArr, salt.byteLength + iv.byteLength);
    const base64Buff = bufferToBase64(buff);

    return base64Buff;
  } catch (e) {
    console.log(`Error - ${e}`);
    return "";
  }
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
    console.log(`Error - ${e}`);
    return "";
  }
}


export async function convertFileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!(file instanceof File)) {
      reject(new TypeError("Expected a File object"));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject(new Error("File could not be read"));
      }
    };
    reader.onerror = () => {
      reject(new Error("File reading has failed"));
    };

    reader.readAsDataURL(file);
  });
}

