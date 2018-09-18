id5
======

国政通 NodeJS SDK

[![npm](https://img.shields.io/npm/v/id5.svg)](https://www.npmjs.com/package/id5)
[![Travis branch](https://img.shields.io/travis/hexindai/id5/master.svg)](https://travis-ci.org/hexindai/id5)
[![Codecov branch](https://img.shields.io/codecov/c/github/hexindai/id5/master.svg)](https://codecov.io/github/hexindai/id5?branch=master)
[![David deps](https://img.shields.io/david/hexindai/id5.svg)](https://david-dm.org/hexindai/id5)
[![Known Vulnerabilities](https://snyk.io/test/npm/id5/badge.svg)](https://snyk.io/test/npm/id5)
[![npm download](https://img.shields.io/npm/dt/id5.svg)](https://www.npmjs.com/package/id5)

### Installation

```bash
npm i id5 -S
```

### Usage

```js
const ID5 = require('id5');

const id5 = new ID5({
  username: 'runrioter',
  password: 'runrioterpsw',
  wsdlUrl: 'https://some.domain/someServices?wsdl',
  key: '87651234',
  iv: '87651234',
});

const matched = await id5.validateIDInfo('马冬梅', '21062419820628XXXX');

if (matched) {
  // ...
} else {
  // ...
}
```

### Debug

Set `DEBUG` env variable to run your program.

`DEBUG=id5` npm run \<some-script\>

### LICENSE
[MIT](LICENSE)
