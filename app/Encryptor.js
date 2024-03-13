// @flow

import CryptoJS from 'crypto-js';

class Encryptor {
  key: string;
  iv: string;
  constructor(key: string) {
    this.key = CryptoJS.enc.Latin1.parse(key);
    this.iv = CryptoJS.enc.Latin1.parse(key);
  }

  encrypt(str: string) {
    const result = CryptoJS.AES.encrypt(
      str,
      this.key,
      {
        iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding,
      },
    );
    return result.toString();
  }

  decrypt(encrypted: string) {
    const decryptedText = CryptoJS.AES.decrypt(encrypted, this.key, { iv: this.iv, padding: CryptoJS.pad.ZeroPadding });
    return decryptedText;
  }
}

export default Encryptor;
