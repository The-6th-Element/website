// src/utils/userManager.js
// Staff and Role-Based Access Control (RBAC) for The Sixth Element
// Features cross-browser and cross-device cloud synchronization via Supabase

import { sha256 } from "./auth.js";

const SUPABASE_URL =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_URL) ||
  "https://crjtogivsllhsxuznufn.supabase.co";

const SUPABASE_ANON_KEY =
  (typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_SUPABASE_ANON_KEY) ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNyanRvZ2l2c2xsaHN4dXpudWZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEyMDU4ODIsImV4cCI6MjEwNjc4MTg4Mn0.uX8IHMaKAApaROFRehMtZADYOMqb2GdIT-ecvrDAOEA";

export const ROLES = {
  admin: {
    id: "admin",
    label: "Admin (Owner)",
    color: "#BF8A2F",
    description: "Full control: publish to live site, user management, site settings, and full menu studio.",
    canPublishLive: true,
    canManageUsers: true,
    canEditMenu: true,
    canManagePromos: true,
    canEditSettings: true,
  },
  manager: {
    id: "manager",
    label: "General Manager",
    color: "#2563EB",
    description: "Manage menu items, prices, CSV imports, and promotions. Saves drafts for Admin to publish.",
    canPublishLive: false,
    canManageUsers: false,
    canEditMenu: true,
    canManagePromos: true,
    canEditSettings: false,
  },
  kitchen: {
    id: "kitchen",
    label: "Kitchen & Bar Lead",
    color: "#059669",
    description: "Update daily specials, mark items out of stock, edit descriptions and dietary tags (V, VE, GF).",
    canPublishLive: false,
    canManageUsers: false,
    canEditMenu: true,
    canManagePromos: false,
    canEditSettings: false,
  },
  marketing: {
    id: "marketing",
    label: "Marketing & Events",
    color: "#7C3AED",
    description: "Create and schedule offers, happy hour promos, and announcements.",
    canPublishLive: false,
    canManageUsers: false,
    canEditMenu: false,
    canManagePromos: true,
    canEditSettings: false,
  },
  staff: {
    id: "staff",
    label: "Staff / Floor Team",
    color: "#6B7280",
    description: "Read-only access for menu ingredients, dietary checks, and customer questions.",
    canPublishLive: false,
    canManageUsers: false,
    canEditMenu: false,
    canManagePromos: false,
    canEditSettings: false,
  },
};

// Standard security questions for self-service password recovery (BK-38)
export const SECURITY_QUESTIONS = [
  "What was the name of your first school or college?",
  "What city or town was your mother born in?",
  "What was the make and model of your first car or bicycle?",
  "What was the name of your first childhood pet?",
  "What street did you grow up on as a child?",
  "What is your favorite dish or drink at The Sixth Element?",
  "What was the name of your favorite teacher or mentor?",
  "In what city did you attend your first live concert?",
];

// Initial seeded accounts (hashed using SHA-256)
// Security questions & answers are not pre-seeded; users choose a question and set their answer during one-time setup.
export const DEFAULT_USERS = [
  {
    username: "admin",
    name: "System Administrator",
    title: "Administrator",
    role: "admin",
    passwordHash: "d9da95ba4aaed71bc6143514f678d6c447502221b5c3dfe4945cae92099d6f3a", // thesixthelement
    securityQuestion: null,
    securityAnswerHash: null,
    isProtected: true, // Primary system administrator account
    createdAt: "2026-10-04",
  },
  {
    username: "pooja",
    name: "Pooja Somani",
    title: "Owner",
    role: "admin",
    passwordHash: "d9da95ba4aaed71bc6143514f678d6c447502221b5c3dfe4945cae92099d6f3a", // thesixthelement
    securityQuestion: null,
    securityAnswerHash: null,
    isProtected: true, // Primary owner account
    createdAt: "2026-10-04",
  },
  {
    username: "deepak",
    name: "Deepak",
    title: "Administrator",
    role: "admin",
    passwordHash: "d9da95ba4aaed71bc6143514f678d6c447502221b5c3dfe4945cae92099d6f3a", // thesixthelement
    securityQuestion: null,
    securityAnswerHash: null,
    isProtected: true, // Primary admin account
    createdAt: "2026-10-04",
  },
  {
    username: "manager",
    name: "Duty Manager",
    title: "General Manager",
    role: "manager",
    passwordHash: "d9da95ba4aaed71bc6143514f678d6c447502221b5c3dfe4945cae92099d6f3a", // thesixthelement
    securityQuestion: null,
    securityAnswerHash: null,
    isProtected: false,
    createdAt: "2026-10-04",
  },
  {
    username: "chef",
    name: "Kitchen & Bar Lead",
    title: "Head Chef",
    role: "kitchen",
    passwordHash: "d9da95ba4aaed71bc6143514f678d6c447502221b5c3dfe4945cae92099d6f3a", // thesixthelement
    securityQuestion: null,
    securityAnswerHash: null,
    isProtected: false,
    createdAt: "2026-10-04",
  },
];

function mapDbRecordToStaffUser(record) {
  if (!record || !record.username) return null;
  return {
    username: record.username.toLowerCase(),
    name: record.name || record.username,
    title: record.title || "",
    role: record.role || "staff",
    passwordHash: record.password_hash,
    securityQuestion: record.security_question || null,
    securityAnswerHash: record.security_answer_hash || null,
    isProtected: Boolean(record.is_protected),
    createdAt: record.created_at ? record.created_at.slice(0, 10) : "2026-10-04",
  };
}

function mapStaffUserToDbRecord(user) {
  return {
    username: user.username.toLowerCase(),
    name: user.name,
    title: user.title || "",
    role: user.role || "staff",
    password_hash: user.passwordHash,
    security_question: user.securityQuestion || null,
    security_answer_hash: user.securityAnswerHash || null,
    is_protected: Boolean(user.isProtected),
    updated_at: new Date().toISOString(),
  };
}

/**
 * Returns list of all staff accounts from browser storage or defaults.
 * Reliably merges seeded default accounts with persisted modifications in localStorage.
 */
export function getStaffUsers() {
  try {
    const saved = localStorage.getItem("tse_staff_users");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Build map seeded with defaults
        const userMap = new Map();
        DEFAULT_USERS.forEach((defUser) => {
          userMap.set(defUser.username.toLowerCase(), { ...defUser });
        });

        // Overlay saved custom properties and accounts
        parsed.forEach((user) => {
          if (!user || !user.username) return;
          const key = user.username.toLowerCase();
          const existing = userMap.get(key);
          if (existing) {
            userMap.set(key, {
              ...existing,
              ...user,
              // Strictly preserve passwordHash and security credentials
              passwordHash: user.passwordHash || existing.passwordHash,
              securityQuestion: user.securityQuestion != null ? user.securityQuestion : existing.securityQuestion,
              securityAnswerHash: user.securityAnswerHash != null ? user.securityAnswerHash : existing.securityAnswerHash,
            });
          } else {
            userMap.set(key, { ...user });
          }
        });

        return Array.from(userMap.values());
      }
    }
  } catch {}
  return DEFAULT_USERS.map((u) => ({ ...u }));
}

/**
 * Persists staff accounts into browser storage and dispatches sync event.
 */
function saveStaffUsers(users) {
  try {
    localStorage.setItem("tse_staff_users", JSON.stringify(users));
  } catch {}
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("tse_staff_users_updated"));
  }
}

/**
 * Synchronizes staff accounts from Supabase cloud database to local storage.
 * Gracefully falls back to localStorage/defaults if offline or table is pending creation.
 */
export async function syncStaffUsersFromCloud() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || typeof fetch === "undefined") {
    return getStaffUsers();
  }

  try {
    const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/staff_users?select=*`;
    const controller = typeof AbortController !== "undefined" ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 3500) : null;

    const res = await fetch(endpoint, {
      method: "GET",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      },
      signal: controller ? controller.signal : undefined,
    });

    if (timeoutId) clearTimeout(timeoutId);

    if (res.ok) {
      const cloudUsers = await res.json();
      if (Array.isArray(cloudUsers) && cloudUsers.length > 0) {
        const userMap = new Map();
        DEFAULT_USERS.forEach((defUser) => {
          userMap.set(defUser.username.toLowerCase(), { ...defUser });
        });

        cloudUsers.forEach((rec) => {
          const appUser = mapDbRecordToStaffUser(rec);
          if (appUser) {
            userMap.set(appUser.username, appUser);
          }
        });

        const merged = Array.from(userMap.values());
        try {
          localStorage.setItem("tse_staff_users", JSON.stringify(merged));
        } catch {}
        if (typeof window !== "undefined") {
          window.dispatchEvent(new Event("tse_staff_users_updated"));
        }
        return merged;
      }
    }
  } catch {
    // Supabase table not yet created, offline, or network error. Silently fall back to local storage.
  }

  return getStaffUsers();
}

async function pushUserUpdateToCloud(user) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || typeof fetch === "undefined") return;
  try {
    const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/staff_users?username=eq.${encodeURIComponent(user.username.toLowerCase())}`;
    const dbRecord = mapStaffUserToDbRecord(user);
    await fetch(endpoint, {
      method: "PATCH",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(dbRecord),
    });
  } catch {
    // Offline or network error; local changes preserved
  }
}

async function pushUserInsertToCloud(user) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || typeof fetch === "undefined") return;
  try {
    const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/staff_users`;
    const dbRecord = mapStaffUserToDbRecord(user);
    await fetch(endpoint, {
      method: "POST",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify(dbRecord),
    });
  } catch {}
}

async function pushUserDeleteToCloud(username) {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || typeof fetch === "undefined") return;
  try {
    const endpoint = `${SUPABASE_URL.replace(/\/+$/, "")}/rest/v1/staff_users?username=eq.${encodeURIComponent(username.toLowerCase())}`;
    await fetch(endpoint, {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_ANON_KEY,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        Prefer: "return=minimal",
      },
    });
  } catch {}
}

/**
 * Authenticates user credentials against the staff directory.
 * Syncs with Supabase cloud first so that credentials updated on other browsers/devices are recognized immediately.
 */
export async function authenticateStaff(username, password) {
  if (!username || !password) {
    throw new Error("Please enter both username and password.");
  }

  // Attempt to sync latest cloud credentials across devices (Edge, Chrome, Safari, mobile)
  try {
    await syncStaffUsersFromCloud();
  } catch {}

  let cleanUser = username.trim().toLowerCase();
  // Support administrator and owner aliases
  if (cleanUser === "administrator") cleanUser = "admin";
  if (cleanUser === "owner") cleanUser = "pooja";

  const inputHash = await sha256(password.trim());
  const users = getStaffUsers();

  let found = users.find(u => 
    u.username.toLowerCase() === cleanUser || 
    (u.name && u.name.toLowerCase() === cleanUser)
  );

  // Fallback to DEFAULT_USERS if missing from custom storage
  if (!found) {
    found = DEFAULT_USERS.find(u => 
      u.username.toLowerCase() === cleanUser || 
      (u.name && u.name.toLowerCase() === cleanUser)
    );
  }

  // Verify hash strictly: changed passwords revoke old defaults
  // Also accept default hash for default accounts if not yet customized
  const isDefaultAccount = ["admin", "pooja", "deepak", "manager", "chef"].includes(found.username.toLowerCase());
  const defaultHashes = [
    "d9da95ba4aaed71bc6143514f678d6c447502221b5c3dfe4945cae92099d6f3a", // thesixthelement
    "b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4", // R1chm0nd-s1xth@007!
    "32730f193cd7a81697cf9d63fb33c8f72442de952e511ea152f8d81a9bc7244c", // Manager@Sixth2026
    "eb95682c0d9d8896842b70c71ce6af9a430f22231cdbcb709cb51fb63dbc5fd8", // Kitchen@Sixth2026
  ];
  const isDefaultPasswordMatch =
    isDefaultAccount &&
    defaultHashes.includes(found.passwordHash) &&
    defaultHashes.includes(inputHash);

  const isValidPassword = Boolean(
    found && (found.passwordHash === inputHash || isDefaultPasswordMatch)
  );

  if (!found || !isValidPassword) {
    throw new Error("Invalid username or password. Please verify and try again.");
  }

  const expiresAt = Date.now() + 12 * 60 * 60 * 1000; // 12 hours
  const payload = `${found.username}:${found.role}:${expiresAt}`;
  const token = btoa(payload);

  return {
    user: found.name || found.username,
    username: found.username,
    role: found.role,
    title: found.title || "",
    hasSecurityQuestion: Boolean(found.securityQuestion && found.securityAnswerHash),
    securityQuestion: found.securityQuestion || null,
    token: token,
  };
}

/**
 * Verifies if an existing session token is active and returns session user info.
 */
export function verifyStaffSession(token) {
  if (!token) return null;
  try {
    const decoded = atob(token);
    const [username, role, expiresAtStr] = decoded.split(":");
    if (!username || !role || !expiresAtStr) return null;
    const expiresAt = parseInt(expiresAtStr, 10);
    if (isNaN(expiresAt) || Date.now() > expiresAt) {
      return null; // Expired
    }

    const users = getStaffUsers();
    const found = users.find(u => u.username.toLowerCase() === username.toLowerCase());
    if (!found) return null;

    return {
      user: found.name || found.username,
      username: found.username,
      role: found.role,
      title: found.title || "",
      hasSecurityQuestion: Boolean(found.securityQuestion && found.securityAnswerHash),
      securityQuestion: found.securityQuestion || null,
    };
  } catch {
    return null;
  }
}

/**
 * Resolves the configured security question for a given username or alias (BK-38).
 */
export function getSecurityQuestionForUser(username) {
  if (!username || !username.trim()) {
    throw new Error("Please enter your username.");
  }

  let cleanUser = username.trim().toLowerCase();
  if (cleanUser === "administrator") cleanUser = "admin";
  if (cleanUser === "owner") cleanUser = "pooja";

  const users = getStaffUsers();
  let found = users.find(
    (u) =>
      u.username.toLowerCase() === cleanUser ||
      (u.name && u.name.toLowerCase() === cleanUser)
  );

  if (!found) {
    found = DEFAULT_USERS.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        (u.name && u.name.toLowerCase() === cleanUser)
    );
  }

  if (!found) {
    throw new Error(`No account found for '${username}'. Please verify your username.`);
  }

  const question = found.securityQuestion;
  const answerHash = found.securityAnswerHash;
  if (!question || !answerHash) {
    throw new Error(
      `No security question has been set up for '${found.name || found.username}' yet. Please log in with your credentials to complete your one-time security setup, or contact an Administrator.`
    );
  }

  return {
    username: found.username,
    name: found.name || found.username,
    question: question,
  };
}

/**
 * One-time setup or update of security question & answer for a staff user (BK-38).
 * Accepts any question selected from the predefined list and securely hashes the answer.
 */
export async function setupSecurityQuestion(username, question, answer) {
  if (!username || !username.trim()) {
    throw new Error("Username is required.");
  }
  if (!question || !question.trim()) {
    throw new Error("Please select a security question from the dropdown list.");
  }
  if (!answer || answer.trim().length < 2) {
    throw new Error("Please provide a secret answer of at least 2 characters.");
  }

  let cleanUser = username.trim().toLowerCase();
  if (cleanUser === "administrator") cleanUser = "admin";
  if (cleanUser === "owner") cleanUser = "pooja";

  const users = getStaffUsers();
  let index = users.findIndex(
    (u) =>
      u.username.toLowerCase() === cleanUser ||
      (u.name && u.name.toLowerCase() === cleanUser)
  );

  let targetUser = index !== -1 ? users[index] : null;

  if (!targetUser) {
    targetUser = DEFAULT_USERS.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        (u.name && u.name.toLowerCase() === cleanUser)
    );
  }

  if (!targetUser) {
    throw new Error(`Account '${username}' not found.`);
  }

  const answerHash = await sha256(answer.trim().toLowerCase());
  const updatedUser = {
    ...targetUser,
    securityQuestion: question.trim(),
    securityAnswerHash: answerHash,
  };

  let updatedList;
  if (index !== -1) {
    updatedList = [...users];
    updatedList[index] = updatedUser;
  } else {
    updatedList = [...users, updatedUser];
  }

  saveStaffUsers(updatedList);
  pushUserUpdateToCloud(updatedUser).catch(() => {});

  return {
    success: true,
    username: targetUser.username,
    name: targetUser.name || targetUser.username,
    question: question.trim(),
  };
}

/**
 * Validates security answer (SHA-256) and resets user's password (BK-38).
 */
export async function verifySecurityAnswerAndResetPassword(username, answer, newPassword) {
  if (!username || !username.trim()) {
    throw new Error("Username is required.");
  }
  if (!answer || !answer.trim()) {
    throw new Error("Please enter your secret answer.");
  }
  if (!newPassword || newPassword.trim().length < 6) {
    throw new Error("New password must be at least 6 characters.");
  }

  let cleanUser = username.trim().toLowerCase();
  if (cleanUser === "administrator") cleanUser = "admin";
  if (cleanUser === "owner") cleanUser = "pooja";

  const users = getStaffUsers();
  let index = users.findIndex(
    (u) =>
      u.username.toLowerCase() === cleanUser ||
      (u.name && u.name.toLowerCase() === cleanUser)
  );

  let targetUser = index !== -1 ? users[index] : null;

  if (!targetUser) {
    targetUser = DEFAULT_USERS.find(
      (u) =>
        u.username.toLowerCase() === cleanUser ||
        (u.name && u.name.toLowerCase() === cleanUser)
    );
  }

  if (!targetUser) {
    throw new Error(`Account '${username}' not found.`);
  }

  const expectedHash = targetUser.securityAnswerHash;
  if (!expectedHash) {
    throw new Error(
      `No security question has been configured for '${targetUser.name || targetUser.username}'. Please contact an Administrator to reset your credentials.`
    );
  }

  const answerHash = await sha256(answer.trim().toLowerCase());

  if (answerHash !== expectedHash) {
    throw new Error("Incorrect answer to secret question. Please try again.");
  }

  const newHash = await sha256(newPassword.trim());
  const updatedUser = {
    ...targetUser,
    passwordHash: newHash,
  };

  let updatedList;
  if (index !== -1) {
    updatedList = [...users];
    updatedList[index] = updatedUser;
  } else {
    updatedList = [...users, updatedUser];
  }

  saveStaffUsers(updatedList);
  pushUserUpdateToCloud(updatedUser).catch(() => {});

  return {
    success: true,
    username: targetUser.username,
    name: targetUser.name,
  };
}

/**
 * Adds a new staff account.
 */
export async function addStaffUser({ username, name, role, title, password, securityQuestion, securityAnswer }) {
  const users = getStaffUsers();
  const cleanUsername = username.trim().toLowerCase();

  if (!cleanUsername) throw new Error("Username is required.");
  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    throw new Error(`Username '${cleanUsername}' already exists.`);
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const hash = await sha256(password.trim());
  const answerHash =
    securityAnswer && securityAnswer.trim()
      ? await sha256(securityAnswer.trim().toLowerCase())
      : null;

  const newUser = {
    username: cleanUsername,
    name: (name || cleanUsername).trim(),
    role: role || "staff",
    title: (title || "").trim(),
    passwordHash: hash,
    securityQuestion: (securityQuestion && answerHash) ? securityQuestion.trim() : null,
    securityAnswerHash: answerHash,
    isProtected: false,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const updated = [...users, newUser];
  saveStaffUsers(updated);
  pushUserInsertToCloud(newUser).catch(() => {});
  return newUser;
}

/**
 * Updates an existing staff account (role, title, name, password, or security question).
 */
export async function updateStaffUser(username, patch) {
  const users = getStaffUsers();
  let cleanUsername = username.toLowerCase();
  if (cleanUsername === "administrator") cleanUsername = "admin";
  if (cleanUsername === "owner") cleanUsername = "pooja";
  const index = users.findIndex((u) => u.username.toLowerCase() === cleanUsername);
  if (index === -1) throw new Error("User not found.");

  const current = users[index];
  const updatedUser = { ...current };

  if (patch.name) updatedUser.name = patch.name.trim();
  if (patch.title != null) updatedUser.title = patch.title.trim();
  if (patch.role && !current.isProtected) updatedUser.role = patch.role;
  if (patch.newPassword) {
    if (patch.newPassword.length < 6) throw new Error("Password must be at least 6 characters.");
    updatedUser.passwordHash = await sha256(patch.newPassword.trim());
  }
  if (patch.securityQuestion != null) {
    updatedUser.securityQuestion = patch.securityQuestion.trim();
  }
  if (patch.newSecurityAnswer) {
    if (patch.newSecurityAnswer.trim().length < 2) {
      throw new Error("Security answer must be at least 2 characters.");
    }
    updatedUser.securityAnswerHash = await sha256(patch.newSecurityAnswer.trim().toLowerCase());
  }

  users[index] = updatedUser;
  saveStaffUsers(users);
  pushUserUpdateToCloud(updatedUser).catch(() => {});
  return updatedUser;
}

/**
 * Deletes a staff account.
 */
export function deleteStaffUser(username) {
  const users = getStaffUsers();
  const cleanUsername = username.toLowerCase();
  const target = users.find(u => u.username.toLowerCase() === cleanUsername);

  if (!target) throw new Error("User not found.");
  if (target.username === "pooja" || cleanUsername === "pooja") {
    throw new Error("The Owner account cannot be deleted.");
  }
  if (target.isProtected || ["admin", "deepak"].includes(cleanUsername)) {
    throw new Error("Core administrator accounts cannot be deleted.");
  }

  const filtered = users.filter(u => u.username.toLowerCase() !== cleanUsername);
  saveStaffUsers(filtered);
  pushUserDeleteToCloud(cleanUsername).catch(() => {});
  return true;
}

/**
 * Checks if a role has a given permission.
 */
export function hasPermission(role, permissionKey) {
  const def = ROLES[role] || ROLES.staff;
  return Boolean(def[permissionKey]);
}

/**
 * Resets all staff accounts to initial seeded defaults, clearing any local overrides.
 */
export function resetStaffUsersToDefault() {
  try {
    localStorage.removeItem("tse_staff_users");
  } catch {}
  window.dispatchEvent(new Event("tse_staff_users_updated"));
  return DEFAULT_USERS;
}

