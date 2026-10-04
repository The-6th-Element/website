// src/components/admin/UserManager.jsx
import React, { useState, useEffect } from "react";
import { COLORS } from "../../theme/tokens";
import {
  ROLES,
  getStaffUsers,
  addStaffUser,
  updateStaffUser,
  deleteStaffUser,
} from "../../utils/userManager.js";

export function UserManager({ theme, currentUser }) {
  const [users, setUsers] = useState(() => getStaffUsers());
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // user object or null
  const [passwordModalUser, setPasswordModalUser] = useState(null); // user object or null
  const [newPassword, setNewPassword] = useState("");
  const [feedback, setFeedback] = useState(null);

  // New user form state
  const blankForm = { username: "", name: "", title: "", role: "manager", password: "" };
  const [form, setForm] = useState(blankForm);

  useEffect(() => {
    const handleSync = () => setUsers(getStaffUsers());
    window.addEventListener("tse_staff_users_updated", handleSync);
    return () => window.removeEventListener("tse_staff_users_updated", handleSync);
  }, []);

  const handleCreate = async () => {
    try {
      if (!form.username || !form.name || !form.password) {
        setFeedback({ type: "error", message: "Please fill in username, full name, and password." });
        return;
      }
      await addStaffUser(form);
      setUsers(getStaffUsers());
      setForm(blankForm);
      setShowAddForm(false);
      setFeedback({ type: "success", message: `Added staff member '${form.name}' successfully!` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const handleDelete = (username) => {
    if (window.confirm(`Are you sure you want to remove user '${username}'?`)) {
      try {
        deleteStaffUser(username);
        setUsers(getStaffUsers());
        setFeedback({ type: "success", message: `Removed user '${username}'.` });
        setTimeout(() => setFeedback(null), 3000);
      } catch (err) {
        setFeedback({ type: "error", message: err.message });
      }
    }
  };

  const handleUpdatePassword = async () => {
    if (!passwordModalUser || !newPassword) return;
    try {
      await updateStaffUser(passwordModalUser.username, { newPassword });
      setUsers(getStaffUsers());
      setPasswordModalUser(null);
      setNewPassword("");
      setFeedback({ type: "success", message: `Updated password for '${passwordModalUser.name}'!` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
    }
  };

  const inputStyle = {
    width: "100%", padding: "8px 10px", borderRadius: 6, marginTop: 4,
    border: `1px solid ${theme.muted}25`, background: theme.surfaceAlt,
    color: theme.text, fontFamily: "'Outfit', sans-serif", fontSize: 12,
  };

  return (
    <div>
      <div style={{ fontSize: 12, color: theme.muted, lineHeight: 1.6, marginBottom: 14, fontWeight: 300 }}>
        Manage team access and permissions. <strong style={{ color: COLORS.warmAmber }}>Only Admins</strong> can publish changes to the live site.
      </div>

      {feedback && (
        <div style={{
          padding: "8px 12px", borderRadius: 6, marginBottom: 12, fontSize: 12,
          background: feedback.type === "success" ? `${COLORS.mossGreen}18` : "#FEE2E2",
          color: feedback.type === "success" ? COLORS.mossGreen : "#991B1B",
          border: `1px solid ${feedback.type === "success" ? `${COLORS.mossGreen}30` : "#FCA5A5"}`,
        }}>
          {feedback.message}
        </div>
      )}

      {/* Users List */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {users.map((u) => {
          const roleDef = ROLES[u.role] || ROLES.staff;
          const isCurrentUser = currentUser?.toLowerCase() === u.username?.toLowerCase();

          return (
            <div
              key={u.username}
              style={{
                padding: "12px 14px",
                borderRadius: 10,
                background: theme.surfaceAlt,
                border: `1px solid ${theme.muted}15`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{
                  width: 32, height: 32, borderRadius: "50%",
                  background: `${roleDef.color}20`,
                  border: `1.5px solid ${roleDef.color}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 12, fontWeight: 700, color: roleDef.color,
                }}>
                  {u.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme.heading, display: "flex", alignItems: "center", gap: 6 }}>
                    <span>{u.name}</span>
                    {isCurrentUser && (
                      <span style={{ fontSize: 10, color: theme.muted, fontWeight: 400 }}>(You)</span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: theme.muted, marginTop: 1 }}>
                    @{u.username} {u.title ? `· ${u.title}` : ""}
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 12,
                  background: `${roleDef.color}20`, color: roleDef.color,
                }}>
                  {roleDef.label}
                </span>

                <button
                  onClick={() => { setPasswordModalUser(u); setNewPassword(""); }}
                  title="Change Password"
                  style={{
                    background: "none", border: `1px solid ${theme.muted}25`, borderRadius: 6,
                    padding: "4px 8px", fontSize: 11, color: theme.muted, cursor: "pointer",
                  }}
                >
                  🔑 Password
                </button>

                {!u.isProtected && u.username !== "pooja" && (
                  <button
                    onClick={() => handleDelete(u.username)}
                    title="Delete User"
                    style={{
                      background: "none", border: "none", color: "#EF4444",
                      fontSize: 15, cursor: "pointer", padding: "2px 6px",
                    }}
                  >
                    🗑
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add New Staff Form */}
      {showAddForm ? (
        <div style={{
          marginTop: 14, padding: 14, borderRadius: 10,
          background: theme.surfaceAlt, border: `1px solid ${theme.muted}20`,
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: theme.heading }}>
            Add New Staff Member
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, textTransform: "uppercase", color: theme.muted, fontWeight: 600 }}>
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))}
                placeholder="e.g. Sarah Jenkins"
                style={inputStyle}
              />
            </div>
            <div>
              <label style={{ fontSize: 10, textTransform: "uppercase", color: theme.muted, fontWeight: 600 }}>
                Username
              </label>
              <input
                value={form.username}
                onChange={(e) => setForm(p => ({ ...p, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") }))}
                placeholder="e.g. sarah"
                style={inputStyle}
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div>
              <label style={{ fontSize: 10, textTransform: "uppercase", color: theme.muted, fontWeight: 600 }}>
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm(p => ({ ...p, role: e.target.value }))}
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                {Object.values(ROLES).map(r => (
                  <option key={r.id} value={r.id}>{r.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 10, textTransform: "uppercase", color: theme.muted, fontWeight: 600 }}>
                Title (Optional)
              </label>
              <input
                value={form.title}
                onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                placeholder="e.g. Evening Shift Lead"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label style={{ fontSize: 10, textTransform: "uppercase", color: theme.muted, fontWeight: 600 }}>
              Temporary Password (min 6 chars)
            </label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
              placeholder="Enter password"
              style={inputStyle}
            />
          </div>

          <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
            <button
              onClick={handleCreate}
              style={{
                flex: 1, padding: "8px", borderRadius: 6, border: "none",
                background: theme.accent, color: "#fff", cursor: "pointer",
                fontSize: 12, fontWeight: 600,
              }}
            >
              Save Staff Member
            </button>
            <button
              onClick={() => { setShowAddForm(false); setForm(blankForm); }}
              style={{
                padding: "8px 12px", borderRadius: 6, border: `1px solid ${theme.muted}25`,
                background: "transparent", color: theme.muted, cursor: "pointer", fontSize: 12,
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            width: "100%", padding: "9px", borderRadius: 8, marginTop: 12,
            border: `1px dashed ${theme.muted}30`, background: "transparent",
            color: theme.accent, cursor: "pointer", fontSize: 12, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}
        >
          <span>+</span>
          <span>Add Staff Member</span>
        </button>
      )}

      {/* Password Reset Modal */}
      {passwordModalUser && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 4000,
          background: "rgba(0,0,0,0.65)", display: "flex", alignItems: "center", justifyContent: "center",
          padding: 24,
        }} onClick={() => setPasswordModalUser(null)}>
          <div onClick={e => e.stopPropagation()} style={{
            width: "100%", maxWidth: 360, background: theme.bg,
            borderRadius: 14, padding: 24, border: `1px solid ${theme.muted}25`,
            boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
          }}>
            <h4 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: theme.heading }}>
              Update Password
            </h4>
            <p style={{ fontSize: 12, color: theme.muted, marginTop: 4, marginBottom: 14 }}>
              Setting new password for <strong>{passwordModalUser.name}</strong> (@{passwordModalUser.username})
            </p>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password (min 6 characters)"
              autoFocus
              style={inputStyle}
            />
            <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
              <button
                onClick={handleUpdatePassword}
                disabled={!newPassword || newPassword.length < 6}
                style={{
                  flex: 1, padding: "9px", borderRadius: 6, border: "none",
                  background: theme.accent, color: "#fff", cursor: "pointer",
                  fontSize: 12, fontWeight: 600,
                  opacity: newPassword.length >= 6 ? 1 : 0.6,
                }}
              >
                Save Password
              </button>
              <button
                onClick={() => setPasswordModalUser(null)}
                style={{
                  padding: "9px 14px", borderRadius: 6, border: `1px solid ${theme.muted}25`,
                  background: "transparent", color: theme.muted, cursor: "pointer", fontSize: 12,
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
