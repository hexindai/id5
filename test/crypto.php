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
  $block_size = mcrypt_get_block_size(MCRYPT_DES, MCRYPT_MODE_CBC);
  $str = mb_convert_encoding($str, 'GBK', 'UTF-8');
  $str = pkcs_pad($str, $block_size);
  $data = mcrypt_encrypt(MCRYPT_DES, $key, $str, MCRYPT_MODE_CBC, $iv);
  return base64_encode($data);
}

function pkcs_pad($str, $block_size) {
  $pad = $block_size - (strlen($str) % $block_size);
  return $str . str_repeat(chr($pad), $pad);
}

function decrypt($str, $key, $iv) {
  $data = base64_decode($str);
  $str = mcrypt_decrypt(MCRYPT_DES, $key, $data, MCRYPT_MODE_CBC, $iv);
  $str = pkcs_unpad($str);
  $str = mb_convert_encoding($str, 'UTF-8', 'GBK');
  return $str;
}

function pkcs_unpad($str) {
    $pad = ord(substr($str, -1));
    if ($pad > strlen($str)) return false;
    if (strspn($str, chr($pad), strlen($str) - $pad) !== $pad) {
        return false;
    }
    return substr($str, 0, -1 * $pad);
}