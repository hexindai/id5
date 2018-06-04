'use strict';

const debug = require('debug')('id5');
const Crypto = require('./lib/crypto');
const soap = require('strong-soap').soap;
const XMLHandler = soap.XMLHandler;
const xmlHandler = new XMLHandler();

class ID5 {

  constructor(options) {
    options = options || {};

    this.username = options.username || throwError('username');
    this.password = options.password || throwError('password');
    this.wsdlUrl = options.wsdlUrl || throwError('wsdlUrl');
    this.key = options.key || throwError('key');
    this.iv = options.iv || throwError('iv');

    debug('id5 config %j', options);

    this.crypto = new Crypto({ key: this.key, iv: this.iv });
  }

  async validateIDInfo(realname, idcard) {
    debug('checking id info: name(%s), idcard(%s)', realname, idcard);
    const params = this.idInfoParams(realname, idcard);
    const p = new Promise((resolve, reject) => {
      soap.createClient(this.wsdlUrl, (err, client) => {
        if (err) {
          return reject(err);
        }
        debug('sending request with params (%j)', params);
        client.querySingle(params, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        }, { timeout: 5000 });
      });
    });
    try {
      const result = await p;
      if (!result.querySingleReturn) return false;
      const xml = this.crypto.decrypt(result.querySingleReturn);
      const jsonResult = xmlHandler.xmlToJson(null, xml, null);
      debug('Got response result (%j)', jsonResult);
      if (jsonResult.data.message.status !== '0') return false;
      return jsonResult.data.policeCheckInfos.policeCheckInfo.compStatus.$value === '3';
    } catch (e) {
      debug('Got error (%s)', e.message);
      throw e;
    }
  }

  idInfoParams(realname, idcard) {
    return {
      type_: this.crypto.encrypt('1A020201'),
      userName_: this.crypto.encrypt(this.username),
      password_: this.crypto.encrypt(this.password),
      param_: this.crypto.encrypt(`${realname},${idcard}`),
    };
  }
}

function throwError(optionKey) {
  throw new Error(`${optionKey} is required`);
}

module.exports = ID5;
