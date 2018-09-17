<?php

if (PHP_SAPI !== 'cli') {
  exit('crypto.php shoud be run in cli mode');
}

if ($argc !== 5) {
  echo <<<USAGE
Usage: php crypto.php <function_name> <data> <key> <iv>

Options:
  * function_name - `encrypt` or `decrypt`
  * data - the data will be encrypted pr decrypted
  * key - the key with which the data was encrypted or decrypted
  * iv -  used for the initialization in CBC, CFB, OFB modes, and in some algorithms in STREAM mode.
USAGE;
}

list( , $function_name, $data, $key, $iv) = $argv;

if (function_exists($function_name)) {
  exit($function_name($data, $key, $iv));
} else {
  exit("`${function_name}` doesn't exist");
}

function encrypt($str, $key , $iv) {
  $str = mb_convert_encoding($str, 'GBK', 'UTF-8');
  $data = openssl_encrypt($str, 'DES-CBC', $key, OPENSSL_RAW_DATA, $iv);
  return base64_encode($data);
}

function decrypt($str, $key, $iv) {
  $data = base64_decode($str);
  $str = openssl_decrypt($data, 'DES-CBC', $key, OPENSSL_RAW_DATA, $iv);
  $str = mb_convert_encoding($str, 'UTF-8', 'GBK');
  return $str;
}
