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

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <VoxlyLogo size={44} />
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
          <div className="mb-6">
            <h1 className="text-xl font-semibold text-white mb-1">Set up your workspace</h1>
            <p className="text-gray-400 text-sm">Tell us about your company to get started.</p>
          </div>

          {error && (
            <div className="bg-red-950 border border-red-800 text-red-300 text-sm px-4 py-3 rounded-lg mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Company name *</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
                placeholder="Acme Sales Co."
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-1.5">Industry</label>
              <select
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
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
              <label className="block text-sm text-gray-400 mb-1.5">Sales team size</label>
              <select
                value={teamSize}
                onChange={(e) => setTeamSize(e.target.value)}
                className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
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
              className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors mt-2"
            >
              {loading ? "Setting up…" : "Launch my workspace →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
