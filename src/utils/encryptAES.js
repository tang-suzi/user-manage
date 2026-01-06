import CryptoJS from "crypto-js";

// AES 密钥（与 Java 一致：1234567887654321）
const AES_KEY = "1234567887654321";
// 偏移量（与 Java 一致：与密钥相同）
const AES_IV = "1234567887654321";

/**
 * AES加密（CBC模式，PKCS5Padding填充，与Java完全对齐）
 * @param {string|object} data - 待加密数据（字符串或对象，对象自动转JSON字符串）
 * @returns {string} 加密后的Base64字符串
 */
export const aesEncrypt = (data) => {
  try {
    // 1. 数据预处理：对象转JSON字符串（与Java接收字符串一致）
    const dataStr =
      typeof data === "object" ? JSON.stringify(data) : String(data);
    console.log("待加密原始数据：", dataStr);

    // 2. 密钥和偏移量处理（UTF-8编码，与Java getBytes()一致）
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(AES_IV);

    // 3. CBC模式加密（PKCS5Padding填充，Java默认PKCS5与PKCS7兼容）
    const encrypted = CryptoJS.AES.encrypt(
      CryptoJS.enc.Utf8.parse(dataStr), // 数据UTF-8编码
      key,
      {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7, // Java PKCS5Padding 与 JS PKCS7Padding 等价
      }
    );

    // 4. 返回Base64编码（与Java一致）
    const encryptedBase64 = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    console.log("加密结果（Base64）：", encryptedBase64);
    return encryptedBase64;
  } catch (error) {
    console.error("AES加密失败：", error);
    return null;
  }
};

/**
 * AES解密（CBC模式，PKCS5Padding填充，与Java完全对齐）
 * @param {string} encryptedData - 加密后的Base64字符串
 * @returns {string|object} 解密后的数据（JSON字符串自动转对象，普通字符串直接返回）
 */
export const aesDecrypt = (encryptedData) => {
  try {
    if (!encryptedData) return "";
    console.log("待解密Base64数据：", encryptedData);

    // 1. 密钥和偏移量处理（UTF-8编码）
    const key = CryptoJS.enc.Utf8.parse(AES_KEY);
    const iv = CryptoJS.enc.Utf8.parse(AES_IV);

    // 2. Base64解码为加密字节流（与Java Base64.getDecoder()一致）
    const encryptedHexStr = CryptoJS.enc.Base64.parse(encryptedData);
    const encryptedBytes = CryptoJS.enc.Base64.stringify(encryptedHexStr);

    // 3. CBC模式解密
    const decrypt = CryptoJS.AES.decrypt(encryptedBytes, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });

    // 4. 解密后转UTF-8字符串（去除多余空格，与Java trim()一致）
    const decryptedStr = decrypt.toString(CryptoJS.enc.Utf8).trim();
    console.log("解密原始字符串：", decryptedStr);

    // 5. 尝试转JSON对象（兼容对象和普通字符串）
    try {
      return JSON.parse(decryptedStr);
    } catch (e) {
      return decryptedStr;
    }
  } catch (error) {
    console.error("AES解密失败：", error);
    return null;
  }
};
