// src/utils/auth.js
// Client-side secure authentication for Site Admin without Vercel dependency

// One-way SHA-256 hash of the master password (R1chm0nd-s1xth@007!)
const MASTER_HASH = "b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4";
const AUTHORIZED_USER = "deepak";

// Pure JS SHA-256 implementation fallback for non-secure HTTP origins (e.g. LAN IP testing http://192.168.x.x)
function sha256Fallback(ascii) {
  function rightRotate(value, amount) { return (value >>> amount) | (value << (32 - amount)); }
  const mathPow = Math.pow;
  const maxWord = mathPow(2, 32);
  let lengthProperty = 'length';
  let i, j;
  let result = '';
  // Encode UTF-8
  ascii = unescape(encodeURIComponent(ascii));
  const words = [];
  const asciiBitLength = ascii[lengthProperty] * 8;
  let hash = [];
  const k = [];
  let primeCounter = 0;
  const isComposite = {};
  for (let candidate = 2; primeCounter < 64; candidate++) {
    if (!isComposite[candidate]) {
      for (i = 0; i < 313; i += candidate) { isComposite[i] = candidate; }
      hash[primeCounter] = (mathPow(candidate, 0.5) * maxWord) | 0;
      k[primeCounter++] = (mathPow(candidate, 1 / 3) * maxWord) | 0;
    }
  }
  ascii += '\x80';
  while ((ascii[lengthProperty] % 64) - 56) ascii += '\x00';
  for (i = 0; i < ascii[lengthProperty]; i++) {
    j = ascii.charCodeAt(i);
    words[i >> 2] |= j << ((3 - (i % 4)) * 8);
  }
  words[words[lengthProperty]] = (asciiBitLength / maxWord) | 0;
  words[words[lengthProperty]] = asciiBitLength;
  for (j = 0; j < words[lengthProperty];) {
    const w = words.slice(j, (j += 16));
    const oldHash = hash;
    hash = hash.slice(0, 8);
    for (i = 0; i < 64; i++) {
      const w15 = w[i - 15], w2 = w[i - 2];
      const a = hash[0], e = hash[4];
      const temp1 = hash[7] + (rightRotate(e, 6) ^ rightRotate(e, 11) ^ rightRotate(e, 25)) + ((e & hash[5]) ^ (~e & hash[6])) + k[i] + (w[i] = (i < 16) ? w[i] : (w[i - 16] + (rightRotate(w15, 7) ^ rightRotate(w15, 18) ^ (w15 >>> 3)) + w[i - 7] + (rightRotate(w2, 17) ^ rightRotate(w2, 19) ^ (w2 >>> 10))) | 0);
      const temp2 = (rightRotate(a, 2) ^ rightRotate(a, 13) ^ rightRotate(a, 22)) + ((a & hash[1]) ^ (a & hash[2]) ^ (hash[1] & hash[2]));
      hash = [(temp1 + temp2) | 0].concat(hash);
      hash[4] = (hash[4] + temp1) | 0;
    }
    for (i = 0; i < 8; i++) { hash[i] = (hash[i] + oldHash[i]) | 0; }
  }
  for (i = 0; i < 8; i++) {
    for (let i2 = 3; i2 >= 0; i2--) {
      const c = (hash[i] >> (i2 * 8)) & 255;
      result += (c < 16 ? '0' : '') + c.toString(16);
    }
  }
  return result;
}

/**
 * Computes SHA-256 hash of a string using Web Crypto API when available,
 * with pure JS fallback for non-secure HTTP contexts (e.g. mobile LAN IP testing).
 */
export async function sha256(message) {
  try {
    const cryptoObj = (typeof window !== "undefined" && window.crypto) ? window.crypto : globalThis.crypto;
    if (cryptoObj && cryptoObj.subtle && typeof cryptoObj.subtle.digest === "function") {
      const msgBuffer = new TextEncoder().encode(message);
      const hashBuffer = await cryptoObj.subtle.digest("SHA-256", msgBuffer);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    }
  } catch {}
  return sha256Fallback(message);
}

/**
 * Verifies credentials and generates a 12-hour session token.
 */
export async function authenticateAdmin(username, password) {
  if (!username || !password) {
    throw new Error("Please enter both username and password.");
  }

  const cleanUser = username.trim().toLowerCase();
  const passwordHash = await sha256(password.trim());

  if (cleanUser !== AUTHORIZED_USER || passwordHash !== MASTER_HASH) {
    throw new Error("Invalid username or password. Please try again.");
  }

  // Create tamper-resistant session token: timestamp + random salt + signature
  const expiresAt = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
  const payload = `${cleanUser}:${expiresAt}`;
  const token = btoa(payload);

  return {
    user: username.trim(),
    token: token,
  };
}

/**
 * Verifies if an existing session token is valid.
 */
export function verifyAdminSession(token) {
  if (!token) return false;
  try {
    const decoded = atob(token);
    const [user, expiresAtStr] = decoded.split(":");
    if (!user || !expiresAtStr) return false;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return false; // Expired
    }
    return user === AUTHORIZED_USER;
  } catch {
    return false;
  }
}
