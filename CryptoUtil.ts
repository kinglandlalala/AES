/**
* AES加密，解密固定步骤，记住就行
*/
import CryptoJS from 'crypto-js';

// 加密
function encrypt(data: string): string {
  const iv = generateRandomIV();
  const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), CryptoJS.enc.parse(SECRET_KEY), {iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7});
  return `${iv.toString(CryptoJS.enc.Base64)}$${encrypted.ciphertext.toString(CryptoJS.enc.Base64)}`;
}

// 解密
function decrypt(encryptedData: string): string {
  const [ivBase64, ciphertextBase64] = encryptedData.split("$");
  if (!ivBase64 || !ciphertextBase64) {
    throw new Error("无效的数据加密格式");
  }
  const iv = CryptoJS.enc.Base64.parse(ivBase64);
  const ciphertext = CryptoJS.enc.Base64.parse(ciphertextBase64);
  const cipherParams = CryptoJS.lib.CipherParams.create({ ciphertext });
  const decrypted = CryptoJS.AES.decrypt(
    cipherParams,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}
