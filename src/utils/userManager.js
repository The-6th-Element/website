// src/utils/userManager.js
// Staff and Role-Based Access Control (RBAC) for The Sixth Element

import { sha256 } from "./auth.js";

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

// Initial seeded accounts
export const DEFAULT_USERS = [
  {
    username: "pooja",
    name: "Pooja Somani",
    title: "Owner",
    role: "admin",
    passwordHash: "b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4", // R1chm0nd-s1xth@007!
    isProtected: true, // Primary owner account
    createdAt: "2026-10-04",
  },
  {
    username: "deepak",
    name: "Deepak",
    title: "Administrator",
    role: "admin",
    passwordHash: "b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4", // R1chm0nd-s1xth@007!
    isProtected: true,
    createdAt: "2026-10-04",
  },
  {
    username: "manager",
    name: "Duty Manager",
    title: "General Manager",
    role: "manager",
    passwordHash: "32730f193cd7a81697cf9d63fb33c8f72442de952e511ea152f8d81a9bc7244c", // Manager@Sixth2026
    isProtected: false,
    createdAt: "2026-10-04",
  },
  {
    username: "chef",
    name: "Kitchen & Bar Lead",
    title: "Head Chef",
    role: "kitchen",
    passwordHash: "eb95682c0d9d8896842b70c71ce6af9a430f22231cdbcb709cb51fb63dbc5fd8", // Kitchen@Sixth2026
    isProtected: false,
    createdAt: "2026-10-04",
  },
];

/**
 * Returns list of all staff accounts from browser storage or defaults.
 */
export function getStaffUsers() {
  try {
    const saved = localStorage.getItem("tse_staff_users");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return DEFAULT_USERS;
}

/**
 * Persists staff accounts into browser storage and dispatches sync event.
 */
export function saveStaffUsers(users) {
  try {
    localStorage.setItem("tse_staff_users", JSON.stringify(users));
  } catch {}
  window.dispatchEvent(new Event("tse_staff_users_updated"));
}

/**
 * Authenticates user credentials against the staff directory.
 */
export async function authenticateStaff(username, password) {
  if (!username || !password) {
    throw new Error("Please enter both username and password.");
  }

  const cleanUser = username.trim().toLowerCase();
  const inputHash = await sha256(password.trim());
  const users = getStaffUsers();

  const found = users.find(u => u.username.toLowerCase() === cleanUser);
  if (!found || found.passwordHash !== inputHash) {
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
    };
  } catch {
    return null;
  }
}

/**
 * Adds a new staff account.
 */
export async function addStaffUser({ username, name, role, title, password }) {
  const users = getStaffUsers();
  const cleanUsername = username.trim().toLowerCase();

  if (!cleanUsername) throw new Error("Username is required.");
  if (users.some(u => u.username.toLowerCase() === cleanUsername)) {
    throw new Error(`Username '${cleanUsername}' already exists.`);
  }
  if (!password || password.length < 6) {
    throw new Error("Password must be at least 6 characters.");
  }

  const hash = await sha256(password.trim());
  const newUser = {
    username: cleanUsername,
    name: (name || cleanUsername).trim(),
    role: role || "staff",
    title: (title || "").trim(),
    passwordHash: hash,
    isProtected: false,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const updated = [...users, newUser];
  saveStaffUsers(updated);
  return newUser;
}

/**
 * Updates an existing staff account (role, title, name, or password).
 */
export async function updateStaffUser(username, patch) {
  const users = getStaffUsers();
  const cleanUsername = username.toLowerCase();
  const index = users.findIndex(u => u.username.toLowerCase() === cleanUsername);
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

  users[index] = updatedUser;
  saveStaffUsers(users);
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
  if (target.isProtected || target.username === "pooja") {
    throw new Error("The Owner account cannot be deleted.");
  }

  const filtered = users.filter(u => u.username.toLowerCase() !== cleanUsername);
  saveStaffUsers(filtered);
  return true;
}

/**
 * Checks if a role has a given permission.
 */
export function hasPermission(role, permissionKey) {
  const def = ROLES[role] || ROLES.staff;
  return Boolean(def[permissionKey]);
}
