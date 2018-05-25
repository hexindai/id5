'use strict';

const crypto = require('crypto');
const iconv = require('iconv-lite');

class Crypto {

  constructor(options) {
    options = options || {};
    if (!options.key || !options.iv) throw new Error('both key and iv are must');
    this.key = options.key;
    this.iv = options.iv;
  }

  encrypt(str) {
    const cipher = crypto.createCipheriv('des-cbc', this.key, this.iv);
    str = iconv.encode(str, 'GBK');
    let data = cipher.update(str, 'utf8', 'base64');
    data += cipher.final('base64');
    return data;
  }

  decrypt(str) {
    const decipher = crypto.createDecipheriv('des-cbc', this.key, this.iv);
    let decrypted = decipher.update(str, 'base64', 'binary');
    decrypted += decipher.final('binary');
    return iconv.decode(Buffer.from(decrypted, 'binary'), 'GBK');
  }
}

module.exports = Crypto;
