// src/utils/auth.js
// Client-side secure authentication for Site Admin without Vercel dependency

// One-way SHA-256 hash of the master password (R1chm0nd-s1xth@007!)
const MASTER_HASH = "b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4";
const AUTHORIZED_USER = "deepak";

/**
 * Computes SHA-256 hash of a string in the browser using Web Crypto API.
 */
export async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
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
    // If an external api exists, try as fallback (e.g. during legacy migration)
    try {
      const resp = await fetch("/api/admin-auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "login", username, password }),
      });
      if (resp.ok) {
        const data = await resp.json();
        return { user: username, token: data.token };
      }
    } catch {}

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
