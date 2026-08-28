"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import VoxlyLogo from "@/components/VoxlyLogo";

export default function OnboardingPage() {
  const router = useRouter();
  const [companyName, setCompanyName] = useState("");
  const [industry, setIndustry] = useState("");
  const [teamSize, setTeamSize] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      router.push("/login");
      return;
    }

    // Create company via security definer function (bypasses RLS)
    const { data: companyId, error: companyError } = await supabase
      .rpc("create_company", {
        p_name: companyName,
        p_industry: industry || null,
        p_team_size: teamSize || null,
      });

    if (companyError || !companyId) {
      setError("Failed to create company: " + (companyError?.message || "unknown error"));
      setLoading(false);
      return;
    }

    const company = { id: companyId };

    // Upsert profile as admin
    const { error: profileError } = await supabase
      .from("profiles")
      .upsert({
        user_id: user.id,
        company_id: company.id,
        full_name: user.user_metadata?.full_name || "",
        email: user.email || "",
        role: "admin",
      }, { onConflict: "user_id" });

    if (profileError) {
      setError("Failed to set up profile: " + profileError.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "var(--surface)",
    border: "1px solid var(--border)", color: "var(--ink)",
    borderRadius: "8px", padding: "10px 14px", fontSize: "14px",
    outline: "none", transition: "border-color .15s", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    display: "block", fontSize: "13px", color: "var(--muted)",
    marginBottom: "6px", fontWeight: 500,
  };

  return (
    <div style={{
      minHeight: "100vh", background: "var(--bg)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "24px",
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "32px" }}>
          <VoxlyLogo size={44} />
        </div>

        <div style={{
          background: "var(--surface)", border: "1px solid var(--border)",
          borderRadius: "var(--radius)", padding: "32px",
        }}>
          <div style={{ marginBottom: "24px" }}>
            <h1 style={{ fontSize: "20px", fontWeight: 700, color: "var(--ink)", marginBottom: "6px" }}>
              Set up your workspace
            </h1>
            <p style={{ fontSize: "13px", color: "var(--muted)" }}>
              Tell us about your company to get started.
            </p>
          </div>

          {error && (
            <div style={{
              background: "#FEE2E2", border: "1px solid #FECACA",
              color: "#991B1B", fontSize: "13px", padding: "12px 16px",
              borderRadius: "8px", marginBottom: "20px",
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div>
              <label style={labelStyle}>Company name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="Acme Sales Co."
                style={inputStyle}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              />
            </div>

            <div>
              <label style={labelStyle}>Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <option value="">Select industry</option>
                <option value="saas">SaaS / Software</option>
                <option value="healthcare">Healthcare</option>
                <option value="financial">Financial Services</option>
                <option value="real_estate">Real Estate</option>
                <option value="staffing">Staffing / Recruiting</option>
                <option value="insurance">Insurance</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={labelStyle}>Sales team size</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer" }}
                onFocus={(e) => { e.currentTarget.style.borderColor = "var(--accent)"; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = "var(--border)"; }}
              >
                <option value="">Select size</option>
                <option value="1-5">1–5 reps</option>
                <option value="6-20">6–20 reps</option>
                <option value="21-50">21–50 reps</option>
                <option value="50+">50+ reps</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", background: "var(--accent)", color: "#fff",
                fontWeight: 600, padding: "12px", borderRadius: "8px",
                fontSize: "14px", border: "none", cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1, transition: "opacity .15s", marginTop: "4px",
              }}
            >
              {loading ? "Setting up…" : "Launch my workspace →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
