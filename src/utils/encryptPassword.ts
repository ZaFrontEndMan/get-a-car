import CryptoJS from "crypto-js";

const SECRET_KEY = "GetCars@**01234567890123456789012";
const IV_STRING = "GetCars@**0123456";

/**
 * Encrypt password using AES CBC mode (matches backend)
 */
export const encryptPassword = (password: string): string => {
  const keyHash = CryptoJS.SHA256(SECRET_KEY);

  // Match backend: just padEnd(16), no substring
  const iv = CryptoJS.enc.Utf8.parse(IV_STRING.padEnd(16, "\0"));

  const encrypted = CryptoJS.AES.encrypt(password, keyHash, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

export const decryptPassword = (encryptedPassword: string): string => {
  const keyHash = CryptoJS.SHA256(SECRET_KEY);
  const iv = CryptoJS.enc.Utf8.parse(IV_STRING.padEnd(16, "\0"));

  const decrypted = CryptoJS.AES.decrypt(encryptedPassword, keyHash, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
};
