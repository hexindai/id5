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
  });
  test('decrypt', () => {
    const data = 'SCMD2zlPU01+/KcmlosbqQ==';
    const phpResult = spawnSync('php', [ '-f', path.join(testRootDir, 'crypto.php'), 'decrypt', data, key, iv ]);
    expect(crypto.decrypt(data)).toEqual(phpResult.stdout.toString());
  });
});
