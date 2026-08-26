"use client";

import { useState } from "react";

interface InviteTeamButtonProps {
  companyId: string;
  invitedBy: string;
}

export default function InviteTeamButton({ companyId, invitedBy }: InviteTeamButtonProps) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<"member" | "admin">("member");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // companyId and invitedBy are passed from server but the actual invite
  // goes through our API route which re-validates server-side
  void companyId; void invitedBy;

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/invite", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email, role }),
    });

    const json = await res.json();

    if (!res.ok) {
      setError(json.error ?? "Something went wrong");
    } else {
      setSuccess(true);
      setEmail("");
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 2500);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        style={{
          background: "#4f46e5",
          color: "#fff",
          fontSize: "13px",
          fontWeight: 500,
          padding: "8px 16px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
        }}
      >
        + Invite member
      </button>

      {open && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 50, padding: "16px",
        }}>
          <div style={{
            background: "#111827", border: "1px solid #1f2937",
            borderRadius: "16px", padding: "24px", width: "100%", maxWidth: "380px",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
              <h2 style={{ fontWeight: 600, color: "#f9fafb", fontSize: "15px" }}>Invite team member</h2>
              <button onClick={() => setOpen(false)} style={{ background: "none", border: "none", color: "#6b7280", cursor: "pointer", fontSize: "20px", lineHeight: 1 }}>×</button>
            </div>

            {success ? (
              <div style={{ textAlign: "center", padding: "16px 0" }}>
                <p style={{ color: "#4ade80", fontWeight: 500, fontSize: "14px" }}>✓ Invite sent!</p>
                <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "6px" }}>
                  {email} will receive an email with a magic link to join your workspace.
                </p>
              </div>
            ) : (
              <form onSubmit={handleInvite}>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="rep@yourcompany.com"
                    style={{
                      width: "100%", background: "#1f2937", border: "1px solid #374151",
                      color: "#f9fafb", borderRadius: "8px", padding: "10px 14px",
                      fontSize: "13px", outline: "none", boxSizing: "border-box",
                    }}
                  />
                </div>

                <div style={{ marginBottom: "20px" }}>
                  <label style={{ display: "block", fontSize: "12px", color: "#9ca3af", marginBottom: "6px" }}>Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "member" | "admin")}
                    style={{
                      width: "100%", background: "#1f2937", border: "1px solid #374151",
                      color: "#f9fafb", borderRadius: "8px", padding: "10px 14px",
                      fontSize: "13px", outline: "none",
                    }}
                  >
                    <option value="member">Member (sales rep)</option>
                    <option value="admin">Admin (manager)</option>
                  </select>
                </div>

                {error && (
                  <p style={{ color: "#f87171", fontSize: "12px", marginBottom: "12px" }}>{error}</p>
                )}

                <div style={{ display: "flex", gap: "12px" }}>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    style={{
                      flex: 1, border: "1px solid #374151", background: "none",
                      color: "#9ca3af", padding: "10px", borderRadius: "8px",
                      fontSize: "13px", cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      flex: 1, background: loading ? "#4338ca" : "#4f46e5",
                      color: "#fff", padding: "10px", borderRadius: "8px",
                      fontSize: "13px", fontWeight: 500, border: "none",
                      cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1,
                    }}
                  >
                    {loading ? "Sending…" : "Send invite"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
