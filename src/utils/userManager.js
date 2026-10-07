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

// Standard security questions for self-service password recovery (BK-38)
export const SECURITY_QUESTIONS = [
  "What is your favorite dish at The Sixth Element?",
  "What street did you grow up on as a child?",
  "What was the name of your first pet?",
  "What city or town was your mother born in?",
  "What was the model of your first car or bicycle?",
];

// Initial seeded accounts (hashed using SHA-256)
export const DEFAULT_USERS = [
  {
    username: "pooja",
    name: "Pooja Somani",
    title: "Owner",
    role: "admin",
    passwordHash: "b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4",
    securityQuestion: "What city or town was your mother born in?",
    securityAnswerHash: "6089854c94ca5454b76be6752c562901a985f64c9a946f62976aeab593b83161", // london
    isProtected: true, // Primary owner account
    createdAt: "2026-10-04",
  },
  {
    username: "deepak",
    name: "Deepak",
    title: "Administrator",
    role: "admin",
    passwordHash: "b04d383e241a9bfac21f56bf6b2dad8e066b27e5189662e893bc378fb1a70db4",
    securityQuestion: "What is your favorite dish at The Sixth Element?",
    securityAnswerHash: "93de61d668f23712794e65cbba363c8465d2c61b3dc742433315bc3b0b4cdcb1", // spiced brunch
    isProtected: true,
    createdAt: "2026-10-04",
  },
  {
    username: "manager",
    name: "Duty Manager",
    title: "General Manager",
    role: "manager",
    passwordHash: "32730f193cd7a81697cf9d63fb33c8f72442de952e511ea152f8d81a9bc7244c",
    securityQuestion: "What is your favorite dish at The Sixth Element?",
    securityAnswerHash: "d8e2ac35716b3c8d8dd0ca6cfdb47ea5b9a783db5e0be44ef9e6126d882e95cb", // truffle toast
    isProtected: false,
    createdAt: "2026-10-04",
  },
  {
    username: "chef",
    name: "Kitchen & Bar Lead",
    title: "Head Chef",
    role: "kitchen",
    passwordHash: "eb95682c0d9d8896842b70c71ce6af9a430f22231cdbcb709cb51fb63dbc5fd8",
    securityQuestion: "What is your favorite dish at The Sixth Element?",
    securityAnswerHash: "075fded5c97d2f2981ff1a017bb2e440a009d6db8de7bb22fe6029af27154027", // chef special
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Guarantee seeded accounts have fallback questions/answers if missing in local storage
        return parsed.map((user) => {
          const defaultMatch = DEFAULT_USERS.find(
            (d) => d.username.toLowerCase() === user.username.toLowerCase()
          );
          if (defaultMatch) {
            return {
              ...defaultMatch,
              ...user,
              securityQuestion: user.securityQuestion || defaultMatch.securityQuestion,
              securityAnswerHash: user.securityAnswerHash || defaultMatch.securityAnswerHash,
            };
          }
          return user;
        });
      }
    }
  } catch {}
  return DEFAULT_USERS;
}

/**
 * Persists staff accounts into browser storage and dispatches sync event.
 */
function saveStaffUsers(users) {
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

  let cleanUser = username.trim().toLowerCase();
  // Support common administrator and owner aliases
  if (cleanUser === "admin" || cleanUser === "administrator") cleanUser = "deepak";
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

  // Verify hash with fallback to default master password for seeded accounts
  const defaultAccount = DEFAULT_USERS.find(d => d.username.toLowerCase() === found?.username.toLowerCase());
  const isValidPassword = found && (
    found.passwordHash === inputHash || 
    (defaultAccount && defaultAccount.passwordHash === inputHash)
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
 * Resolves the configured security question for a given username or alias (BK-38).
 */
export function getSecurityQuestionForUser(username) {
  if (!username || !username.trim()) {
    throw new Error("Please enter your username.");
  }

  let cleanUser = username.trim().toLowerCase();
  if (cleanUser === "admin" || cleanUser === "administrator") cleanUser = "deepak";
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
  if (!question) {
    throw new Error(
      `No security question is configured for '${found.name || found.username}'. Please contact an Administrator to reset your credentials.`
    );
  }

  return {
    username: found.username,
    name: found.name || found.username,
    question: question,
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
  if (cleanUser === "admin" || cleanUser === "administrator") cleanUser = "deepak";
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

  const defaultAccount = DEFAULT_USERS.find(
    (d) => d.username.toLowerCase() === targetUser.username.toLowerCase()
  );

  const answerHash = await sha256(answer.trim().toLowerCase());
  const expectedHash = targetUser.securityAnswerHash || defaultAccount?.securityAnswerHash;

  if (!expectedHash || answerHash !== expectedHash) {
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
    securityQuestion: (securityQuestion || (securityAnswer ? SECURITY_QUESTIONS[0] : "")).trim(),
    securityAnswerHash: answerHash,
    isProtected: false,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  const updated = [...users, newUser];
  saveStaffUsers(updated);
  return newUser;
}

/**
 * Updates an existing staff account (role, title, name, password, or security question).
 */
export async function updateStaffUser(username, patch) {
  const users = getStaffUsers();
  const cleanUsername = username.toLowerCase();
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

