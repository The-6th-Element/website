// src/utils/githubPublisher.js
// Direct in-browser GitHub API publishing service for The Sixth Element

import { menuToCsv } from "./csvMenuParser.js";

const DEFAULT_REPO = "The-6th-Element/website";

/**
 * Encodes a UTF-8 string to base64 safely (handles emojis and special characters).
 */
export function utf8ToBase64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

/**
 * Retrieves the stored GitHub Personal Access Token from browser storage.
 */
export function getStoredGithubToken() {
  try {
    return localStorage.getItem("tse_github_token") || "";
  } catch {
    return "";
  }
}

/**
 * Saves the GitHub Personal Access Token in browser storage.
 */
export function setStoredGithubToken(token) {
  try {
    if (token) {
      localStorage.setItem("tse_github_token", token.trim());
    } else {
      localStorage.removeItem("tse_github_token");
    }
  } catch {}
}

/**
 * Clears the stored GitHub token.
 */
export function clearStoredGithubToken() {
  try {
    localStorage.removeItem("tse_github_token");
  } catch {}
}

/**
 * Validates a GitHub token and retrieves user info.
 */
export async function validateGithubToken(token) {
  if (!token || !token.trim()) throw new Error("Please enter a GitHub personal access token.");

  const resp = await fetch("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token.trim()}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (!resp.ok) {
    if (resp.status === 401) {
      throw new Error("Invalid GitHub token. Please verify the token is active and not expired.");
    }
    throw new Error(`GitHub validation error (${resp.status}): ${resp.statusText}`);
  }

  const user = await resp.json();
  return {
    username: user.login,
    name: user.name || user.login,
    avatarUrl: user.avatar_url,
  };
}

/**
 * Publishes the updated menu CSV directly to the GitHub repository.
 *
 * @param {Object} options
 * @param {Object} options.menuData - The structured menu data
 * @param {string} [options.token] - GitHub Personal Access Token (defaults to stored token)
 * @param {string} [options.branch] - Target branch ('dev' or 'main', defaults to current branch)
 * @param {string} [options.commitMessage] - Custom commit message
 * @param {Function} [options.onProgress] - Status callback for UI progress
 */
export async function publishMenuToGithub({
  menuData,
  token = getStoredGithubToken(),
  branch = "dev",
  commitMessage,
  onProgress = () => {},
}) {
  if (!token || !token.trim()) {
    throw new Error("GitHub token is required to publish live changes. Please configure your token.");
  }

  const filePath = "public/data/the_sixth_element_menu.csv";
  const repo = DEFAULT_REPO;
  const cleanToken = token.trim();

  onProgress({ step: "csv", label: "Generating standardised CSV format..." });
  const csvContent = menuToCsv(menuData);
  const base64Content = utf8ToBase64("\uFEFF" + csvContent);

  // Step 1: Check existing file to obtain SHA
  onProgress({ step: "fetch_sha", label: `Checking existing ${filePath} on branch '${branch}'...` });
  let existingSha = null;
  const getUrl = `https://api.github.com/repos/${repo}/contents/${filePath}?ref=${branch}`;

  const getResp = await fetch(getUrl, {
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: "application/vnd.github.v3+json",
    },
  });

  if (getResp.ok) {
    const fileMeta = await getResp.json();
    existingSha = fileMeta.sha;
  } else if (getResp.status !== 404) {
    const err = await getResp.json().catch(() => ({}));
    throw new Error(err.message || `Failed to check repository (${getResp.status})`);
  }

  // Step 2: Commit file to GitHub
  onProgress({ step: "commit", label: `Committing updated menu to GitHub (${branch})...` });
  const putUrl = `https://api.github.com/repos/${repo}/contents/${filePath}`;
  const nowStr = new Date().toLocaleString("en-GB", { timeZone: "Europe/London" });
  const defaultMsg = `chore(menu): update restaurant menu via Menu Studio [${nowStr}]`;

  const payload = {
    message: commitMessage || defaultMsg,
    content: base64Content,
    branch: branch,
    ...(existingSha ? { sha: existingSha } : {}),
  };

  const putResp = await fetch(putUrl, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${cleanToken}`,
      Accept: "application/vnd.github.v3+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!putResp.ok) {
    const err = await putResp.json().catch(() => ({}));
    if (putResp.status === 409) {
      throw new Error("Conflict: the menu on GitHub was modified recently. Please refresh and try again.");
    }
    throw new Error(err.message || `Failed to commit to GitHub (${putResp.status})`);
  }

  const result = await putResp.json();
  const commitSha = result.commit?.sha?.slice(0, 7) || "latest";
  const commitUrl = result.commit?.html_url || `https://github.com/${repo}/commits/${branch}`;

  onProgress({
    step: "committed",
    label: `Committed (${commitSha})! Triggering automatic build & deployment...`,
    commitSha,
    commitUrl,
  });

  return {
    success: true,
    commitSha,
    commitUrl,
    branch,
  };
}
