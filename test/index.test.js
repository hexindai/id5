'use strict';

const path = require('path');
const { spawnSync } = require('child_process');
const Crypto = require('../lib/crypto');

const key = '87651234';
const iv = '87651234';
const crypto = new Crypto({ key, iv });

const testRootDir = __dirname;

describe('lib/crypto', () => {
  test('constructor', () => {
    expect(() => {
      new Crypto();
    }).toThrowError('both key and iv are must');
  });

  test('encrypt', () => {
    const data = 'id5.encrypt';
    const phpResult = spawnSync('php', [ '-f', path.join(testRootDir, 'crypto.php'), 'encrypt', data, key, iv ]);
    expect(crypto.encrypt(data)).toEqual(phpResult.stdout.toString());
    const data1 = '马冬梅,21062419820628XXXX';
    const phpResult1 = spawnSync('php', [ '-f', path.join(testRootDir, 'crypto.php'), 'encrypt', data1, key, iv ]);
    expect(crypto.encrypt(data1)).toEqual(phpResult1.stdout.toString());
  });

  test('decrypt', () => {
    const data = 'SCMD2zlPU01+/KcmlosbqQ==';
    const phpResult = spawnSync('php', [ '-f', path.join(testRootDir, 'crypto.php'), 'decrypt', data, key, iv ]);
    expect(crypto.decrypt(data)).toEqual(phpResult.stdout.toString());
    const data1 = 'FtSWojggCTBZ6JmqqMuizbIq3u+r2tsB2igbJ8QILf4=';
    const phpResult1 = spawnSync('php', [ '-f', path.join(testRootDir, 'crypto.php'), 'decrypt', data1, key, iv ]);
    expect(crypto.decrypt(data1)).toEqual(phpResult1.stdout.toString());
  });

  test('nodejs encrypt & decrypt', () => {
    const data = '马冬梅,21062419820628XXXX';
    const encrypted = crypto.encrypt(data);
    expect(crypto.decrypt(encrypted)).toEqual(data);
  });

  test('php encrypt & decrypt', () => {
    const data = '马冬梅,21062419820628XXXX';
    const result1 = spawnSync('php', [ '-f', path.join(testRootDir, 'crypto.php'), 'encrypt', data, key, iv ]);
    const encrypted = result1.stdout.toString();
    const result2 = spawnSync('php', [ '-f', path.join(testRootDir, 'crypto.php'), 'decrypt', encrypted, key, iv ]);
    const decrypted = result2.stdout.toString();
    expect(decrypted).toEqual(data);
  });
});
