/* eslint-disable no-bitwise -- SHA-256 is defined in terms of bitwise operations. */
/**
 * Minimal SHA-256 (hex output). Used only to avoid storing demo passwords in
 * plain text; it is not a substitute for server-side password hashing.
 */

const firstPrimes = (count: number): number[] => {
  const primes: number[] = [];
  for (let candidate = 2; primes.length < count; candidate++) {
    if (primes.every(prime => candidate % prime !== 0)) {
      primes.push(candidate);
    }
  }
  return primes;
};

const fractionBits = (value: number) =>
  ((value - Math.floor(value)) * 0x100000000) >>> 0;

const PRIMES = firstPrimes(64);
const INITIAL_HASH = PRIMES.slice(0, 8).map(prime =>
  fractionBits(Math.sqrt(prime)),
);
const ROUND_CONSTANTS = PRIMES.map(prime => fractionBits(Math.cbrt(prime)));

const utf8Bytes = (text: string): number[] => {
  const bytes: number[] = [];
  for (const char of text) {
    const code = char.codePointAt(0) as number;
    if (code < 0x80) {
      bytes.push(code);
    } else if (code < 0x800) {
      bytes.push(0xc0 | (code >> 6), 0x80 | (code & 0x3f));
    } else if (code < 0x10000) {
      bytes.push(
        0xe0 | (code >> 12),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
    } else {
      bytes.push(
        0xf0 | (code >> 18),
        0x80 | ((code >> 12) & 0x3f),
        0x80 | ((code >> 6) & 0x3f),
        0x80 | (code & 0x3f),
      );
    }
  }
  return bytes;
};

const rotateRight = (value: number, bits: number) =>
  (value >>> bits) | (value << (32 - bits));

export const sha256 = (message: string): string => {
  const bytes = utf8Bytes(message);
  const bitLength = bytes.length * 8;

  bytes.push(0x80);
  while (bytes.length % 64 !== 56) {
    bytes.push(0);
  }
  // 64-bit big-endian length; messages here are far below 2^32 bits.
  bytes.push(0, 0, 0, 0);
  bytes.push(
    (bitLength >>> 24) & 0xff,
    (bitLength >>> 16) & 0xff,
    (bitLength >>> 8) & 0xff,
    bitLength & 0xff,
  );

  const hash = [...INITIAL_HASH];
  const words = new Array<number>(64);

  for (let offset = 0; offset < bytes.length; offset += 64) {
    for (let i = 0; i < 16; i++) {
      const j = offset + i * 4;
      words[i] =
        ((bytes[j] << 24) |
          (bytes[j + 1] << 16) |
          (bytes[j + 2] << 8) |
          bytes[j + 3]) >>>
        0;
    }
    for (let i = 16; i < 64; i++) {
      const s0 =
        rotateRight(words[i - 15], 7) ^
        rotateRight(words[i - 15], 18) ^
        (words[i - 15] >>> 3);
      const s1 =
        rotateRight(words[i - 2], 17) ^
        rotateRight(words[i - 2], 19) ^
        (words[i - 2] >>> 10);
      words[i] = (words[i - 16] + s0 + words[i - 7] + s1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;
    for (let i = 0; i < 64; i++) {
      const sum1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choice = (e & f) ^ (~e & g);
      const temp1 = (h + sum1 + choice + ROUND_CONSTANTS[i] + words[i]) >>> 0;
      const sum0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (sum0 + majority) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }

    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  return hash.map(value => value.toString(16).padStart(8, '0')).join('');
};
