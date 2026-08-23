"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase-browser";

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

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.from("team_invites").insert({
      company_id: companyId,
      invited_by: invitedBy,
      email,
      role,
      status: "pending",
    });

    if (error) {
      alert("Failed to send invite: " + error.message);
    } else {
      setSuccess(true);
      setEmail("");
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
      >
        + Invite member
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-sm">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-white">Invite team member</h2>
              <button onClick={() => setOpen(false)} className="text-gray-500 hover:text-white text-lg">×</button>
            </div>

            {success ? (
              <div className="text-center py-4">
                <p className="text-green-400 font-medium">✓ Invite recorded!</p>
                <p className="text-gray-500 text-sm mt-1">Share the sign-up link with your teammate.</p>
              </div>
            ) : (
              <form onSubmit={handleInvite} className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Email address</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="rep@yourcompany.com"
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1.5">Role</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as "member" | "admin")}
                    className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500"
                  >
                    <option value="member">Member (rep)</option>
                    <option value="admin">Admin (manager)</option>
                  </select>
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="flex-1 border border-gray-700 text-gray-400 py-2 rounded-lg text-sm hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    {loading ? "Inviting…" : "Send invite"}
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
