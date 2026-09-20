import Link from "next/link";

export const metadata = {
  title: "Voxly — AI Sales Call Coaching",
  description: "Get Gong-level coaching at a fraction of the price. Voxly analyzes every sales call, scores your reps, and tells them exactly what to fix.",
};

export default function LandingPage() {
  return (
    <div style={{ fontFamily: "Inter, system-ui, sans-serif", color: "#0f172a", background: "#fff" }}>

      {/* ── Nav ── */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 50,
        borderBottom: "1px solid #e2e8f0",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
      }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", padding: "0 24px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
              <defs>
                <linearGradient id="lL" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#6366f1"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
                <linearGradient id="lR" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06b6d4"/>
                  <stop offset="100%" stopColor="#3b82f6"/>
                </linearGradient>
              </defs>
              <polygon points="4,32 20,4 20,20" fill="url(#lL)"/>
              <polygon points="20,4 36,32 20,20" fill="url(#lR)"/>
              <circle cx="20" cy="34" r="3" fill="url(#lR)" opacity="0.9"/>
            </svg>
            <span style={{ fontSize: 18, fontWeight: 800, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              voxly
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <a href="/login" style={{ fontSize: 14, fontWeight: 500, color: "#64748b", textDecoration: "none", padding: "8px 16px" }}
               className="nav-link">
              Sign in
            </a>
            <a href="/signup" style={{
              fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none",
              padding: "8px 20px", borderRadius: 8,
              background: "linear-gradient(135deg,#6366f1,#06b6d4)",
            }}
               className="cta-btn">
              Start free trial
            </a>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px 64px", textAlign: "center" }}>
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 8,
          background: "#f0f9ff", border: "1px solid #bae6fd",
          borderRadius: 99, padding: "6px 16px", marginBottom: 32,
        }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#06b6d4", display: "inline-block" }}/>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#0369a1" }}>AI-powered · No per-seat Gong pricing</span>
        </div>

        <h1 style={{
          fontSize: "clamp(36px,5vw,64px)",
          fontWeight: 800, lineHeight: 1.1,
          letterSpacing: "-0.03em",
          marginBottom: 24,
          maxWidth: 820, margin: "0 auto 24px",
        }}>
          Your reps record the call.<br/>
          <span style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Voxly coaches them.
          </span>
        </h1>

        <p style={{ fontSize: 20, color: "#475569", lineHeight: 1.6, maxWidth: 580, margin: "0 auto 40px" }}>
          Transcription, AI scoring, objection analysis, and coaching feedback on every call — for a fraction of what Gong charges.
        </p>

        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/signup" style={{
            fontSize: 16, fontWeight: 700, color: "#fff", textDecoration: "none",
            padding: "14px 32px", borderRadius: 10,
            background: "linear-gradient(135deg,#6366f1,#06b6d4)",
            boxShadow: "0 4px 24px rgba(99,102,241,.35)",
          }} className="cta-btn">
            Start free — 3 calls included
          </a>
          <a href="#pricing" style={{
            fontSize: 16, fontWeight: 600, color: "#6366f1", textDecoration: "none",
            padding: "14px 32px", borderRadius: 10,
            border: "1.5px solid #c7d2fe",
            background: "#fff",
          }} className="outline-btn">
            See pricing
          </a>
        </div>

        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 16 }}>No credit card required · Setup in 5 minutes</p>

        {/* Demo video */}
        <div style={{
          marginTop: 64,
          borderRadius: 16,
          border: "1px solid #e2e8f0",
          boxShadow: "0 24px 64px rgba(0,0,0,.08), 0 4px 16px rgba(99,102,241,.1)",
          overflow: "hidden",
          background: "#000",
          position: "relative",
          paddingBottom: "56.25%", // 16:9
          height: 0,
        }}>
          {/* ↓ Replace this src with your Loom or YouTube embed URL */}
          <iframe
            src="REPLACE_WITH_YOUR_DEMO_VIDEO_EMBED_URL"
            style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: "none" }}
            allow="autoplay; fullscreen"
            allowFullScreen
          />
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32, textAlign: "center" }}>
          {[
            { value: "< 5 min", label: "Time to first coaching insight" },
            { value: "$35", label: "Per user / month — vs $100+ at Gong" },
            { value: "3 free", label: "Calls to start — no card required" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontSize: 36, fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</p>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,.8)", marginTop: 8 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>
            Everything Gong does.<br/>At a price your team can actually afford.
          </h2>
          <p style={{ fontSize: 18, color: "#64748b", maxWidth: 520, margin: "0 auto" }}>
            Built for SMB sales teams who need real coaching — not enterprise software with an enterprise invoice.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24 }}>
          {[
            {
              icon: "🎙",
              title: "Instant Transcription",
              body: "Upload MP3 or MP4. AssemblyAI transcribes the call in minutes with speaker separation and talk-ratio breakdown.",
            },
            {
              icon: "🤖",
              title: "AI Coaching Score",
              body: "Every call gets a score out of 100. Reps know exactly where they lost momentum — opener, objections, or close.",
            },
            {
              icon: "📊",
              title: "Objection & Signal Analysis",
              body: "Voxly tags every objection raised and every buying signal your rep missed. Coaching is specific, not vague.",
            },
            {
              icon: "👥",
              title: "Team Leaderboard",
              body: "Managers see win rates, average scores, and call volume per rep — without sitting in on every call.",
            },
          ].map((f) => (
            <div key={f.title} style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "28px 24px",
            }} className="feature-card">
              <p style={{ fontSize: 32, marginBottom: 16 }}>{f.icon}</p>
              <h3 style={{ fontSize: 17, fontWeight: 700, marginBottom: 10, color: "#0f172a" }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Voxly vs Gong ── */}
      <section style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 820, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>
              Voxly vs. Gong
            </h2>
            <p style={{ fontSize: 16, color: "#64748b" }}>Why teams are making the switch.</p>
          </div>

          <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 16, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#f8fafc" }}>
                  <th style={{ padding: "16px 24px", textAlign: "left", fontSize: 13, color: "#94a3b8", fontWeight: 600, borderBottom: "1px solid #e2e8f0" }}>Feature</th>
                  <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 14, fontWeight: 700, color: "#6366f1", borderBottom: "1px solid #e2e8f0" }}>Voxly</th>
                  <th style={{ padding: "16px 24px", textAlign: "center", fontSize: 14, fontWeight: 600, color: "#94a3b8", borderBottom: "1px solid #e2e8f0" }}>Gong</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Price", "$35/user/mo", "$100–160/user/mo"],
                  ["Call transcription", "✓", "✓"],
                  ["AI coaching score", "✓", "✓"],
                  ["Objection analysis", "✓", "✓"],
                  ["Buying signal detection", "✓", "✓"],
                  ["Team leaderboard", "✓", "✓"],
                  ["Free trial (no card)", "3 calls free", "Demo required"],
                  ["Setup time", "< 5 minutes", "2–4 weeks onboarding"],
                  ["Contract required", "No — month to month", "Annual contract"],
                  ["Min seat requirement", "1 user", "Typically 5+ seats"],
                ].map(([feat, voxly, gong], i) => (
                  <tr key={feat} style={{ background: i % 2 === 0 ? "#fff" : "#fafafa" }}>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#374151", borderBottom: "1px solid #f1f5f9", fontWeight: 500 }}>{feat}</td>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#6366f1", fontWeight: 600, textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>{voxly}</td>
                    <td style={{ padding: "14px 24px", fontSize: 14, color: "#94a3b8", textAlign: "center", borderBottom: "1px solid #f1f5f9" }}>{gong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section style={{ maxWidth: 1120, margin: "0 auto", padding: "80px 24px" }}>
        <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 48 }}>
          What sales teams are saying
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {[
            {
              quote: "We went from flying blind on calls to having coaching feedback in my inbox every morning. Our close rate is up 18% in 6 weeks.",
              name: "Jordan M.",
              title: "Sales Manager",
              company: "TechFlow",
            },
            {
              quote: "Gong wanted $6,000 a year minimum. Voxly does everything we actually needed for $175/mo. It's not even close.",
              name: "Priya S.",
              title: "VP of Sales",
              company: "Meridian Software",
            },
          ].map((t) => (
            <div key={t.name} style={{
              background: "#fff",
              border: "1px solid #e2e8f0",
              borderRadius: 14,
              padding: "32px 28px",
            }}>
              <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.7, marginBottom: 24, fontStyle: "italic" }}>
                &ldquo;{t.quote}&rdquo;
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: "50%",
                  background: "linear-gradient(135deg,#6366f1,#06b6d4)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: "#fff",
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>{t.name}</p>
                  <p style={{ fontSize: 12, color: "#64748b" }}>{t.title} · {t.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" style={{ background: "#f8fafc", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 12 }}>Simple pricing</h2>
            <p style={{ fontSize: 16, color: "#64748b" }}>Start free. Pay when it's working.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: 24, alignItems: "start" }}>
            {[
              {
                name: "Starter",
                price: "$39",
                period: "/user/mo",
                desc: "For solo reps and small teams getting started.",
                features: ["3 free calls to start", "Unlimited calls after", "AI coaching score", "Objection & signal analysis", "Call transcription", "Email support"],
                cta: "Start free trial",
                highlight: false,
              },
              {
                name: "Team",
                price: "$35",
                period: "/user/mo · billed annually",
                desc: "For sales teams who want manager visibility.",
                features: ["Everything in Starter", "Team leaderboard", "Per-rep performance stats", "Win rate tracking", "Manager dashboard", "Priority support"],
                cta: "Start free trial",
                highlight: true,
              },
              {
                name: "Enterprise",
                price: "Custom",
                period: "",
                desc: "For organizations with 20+ reps or compliance needs.",
                features: ["Everything in Team", "Dedicated onboarding", "SLA & uptime guarantee", "SSO / SAML", "Custom data retention", "Dedicated account manager"],
                cta: "Contact us",
                highlight: false,
              },
            ].map((plan) => (
              <div key={plan.name} style={{
                background: plan.highlight ? "linear-gradient(145deg,#6366f1,#4f46e5)" : "#fff",
                border: plan.highlight ? "none" : "1px solid #e2e8f0",
                borderRadius: 16,
                padding: "32px 28px",
                position: "relative",
              }}>
                {plan.highlight && (
                  <div style={{
                    position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
                    background: "#06b6d4", color: "#fff", fontSize: 11, fontWeight: 700,
                    padding: "4px 14px", borderRadius: 99, letterSpacing: "0.06em",
                  }}>
                    MOST POPULAR
                  </div>
                )}
                <p style={{ fontSize: 14, fontWeight: 700, color: plan.highlight ? "rgba(255,255,255,.7)" : "#6366f1", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{plan.name}</p>
                <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 40, fontWeight: 800, color: plan.highlight ? "#fff" : "#0f172a" }}>{plan.price}</span>
                  <span style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,.6)" : "#94a3b8" }}>{plan.period}</span>
                </div>
                <p style={{ fontSize: 13, color: plan.highlight ? "rgba(255,255,255,.7)" : "#64748b", marginBottom: 28, lineHeight: 1.5 }}>{plan.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px", display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 13, color: plan.highlight ? "rgba(255,255,255,.9)" : "#374151" }}>
                      <span style={{ color: plan.highlight ? "#a5f3fc" : "#6366f1", flexShrink: 0, fontWeight: 700 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <a href={plan.cta === "Contact us" ? "mailto:support@voxly.ai" : "/signup"} style={{
                  display: "block", textAlign: "center",
                  padding: "12px 24px", borderRadius: 10,
                  fontSize: 14, fontWeight: 700, textDecoration: "none",
                  background: plan.highlight ? "#fff" : "linear-gradient(135deg,#6366f1,#06b6d4)",
                  color: plan.highlight ? "#6366f1" : "#fff",
                }} className="cta-btn">
                  {plan.cta}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ maxWidth: 720, margin: "0 auto", padding: "80px 24px", textAlign: "center" }}>
        <h2 style={{ fontSize: 40, fontWeight: 800, letterSpacing: "-0.03em", marginBottom: 16 }}>
          Your next call is being recorded.<br/>
          <span style={{ background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            Make sure it gets coached.
          </span>
        </h2>
        <p style={{ fontSize: 18, color: "#64748b", marginBottom: 40 }}>
          Start free with 3 calls. No credit card, no onboarding call, no 12-month contract.
        </p>
        <a href="/signup" style={{
          display: "inline-block",
          fontSize: 18, fontWeight: 700, color: "#fff", textDecoration: "none",
          padding: "16px 48px", borderRadius: 12,
          background: "linear-gradient(135deg,#6366f1,#06b6d4)",
          boxShadow: "0 8px 32px rgba(99,102,241,.35)",
        }} className="cta-btn">
          Start free trial →
        </a>
        <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 16 }}>3 free calls · No card required · Setup in 5 minutes</p>
      </section>

      {/* ── Footer ── */}
      <footer style={{ borderTop: "1px solid #e2e8f0", padding: "40px 24px" }}>
        <div style={{ maxWidth: 1120, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
              <polygon points="4,32 20,4 20,20" fill="#6366f1"/>
              <polygon points="20,4 36,32 20,20" fill="#06b6d4"/>
            </svg>
            <span style={{ fontWeight: 800, fontSize: 14, background: "linear-gradient(135deg,#6366f1,#06b6d4)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>voxly</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 13, color: "#94a3b8" }}>
            <a href="/login" style={{ color: "#64748b", textDecoration: "none" }}>Sign in</a>
            <a href="/signup" style={{ color: "#64748b", textDecoration: "none" }}>Sign up</a>
            <a href="mailto:support@voxly.ai" style={{ color: "#64748b", textDecoration: "none" }}>Support</a>
          </div>
          <p style={{ fontSize: 12, color: "#cbd5e1" }}>© 2026 Voxly. All rights reserved.</p>
        </div>
      </footer>

      <style>{`
        .nav-link:hover { color: #6366f1 !important; }
        .cta-btn { transition: opacity .15s, transform .15s; }
        .cta-btn:hover { opacity: .9; transform: translateY(-1px); }
        .outline-btn:hover { background: #f0f4ff !important; }
        .feature-card { transition: box-shadow .15s, transform .15s; }
        .feature-card:hover { box-shadow: 0 8px 32px rgba(99,102,241,.12); transform: translateY(-2px); }
        @media (max-width: 640px) {
          table { font-size: 12px !important; }
          td, th { padding: 10px 12px !important; }
        }
      `}</style>
    </div>
  );
}
