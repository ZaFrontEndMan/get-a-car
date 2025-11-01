import CryptoJS from "crypto-js";

const SECRET_KEY = "GetCars@**01234567890123456789012";
const IV_STRING = "GetCars@**0123456";

/**
 * Encrypt password using AES CBC mode
 * @param password - Plain text password
 * @returns Encrypted password in base64 format
 */
export const encryptPassword = (password: string): string => {
  // Generate SHA-256 hash of the secret key
  const keyHash = CryptoJS.SHA256(SECRET_KEY);

  // Pad or trim IV to exactly 16 bytes
  const iv = CryptoJS.enc.Utf8.parse(
    IV_STRING.padEnd(16, "\0").substring(0, 16)
  );

  // Encrypt using AES CBC mode
  const encrypted = CryptoJS.AES.encrypt(password, keyHash, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Return as base64 string
  return encrypted.toString();
};

/**
 * Decrypt password (for reference/testing only)
 * @param encryptedPassword - Encrypted password in base64 format
 * @returns Decrypted plain text password
 */
export const decryptPassword = (encryptedPassword: string): string => {
  const keyHash = CryptoJS.SHA256(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(
    IV_STRING.padEnd(16, "\0").substring(0, 16)
  );

  const decrypted = CryptoJS.AES.decrypt(encryptedPassword, keyHash, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
