import { Plus_Jakarta_Sans, DM_Sans, Space_Mono } from "next/font/google";
import HeroDemo from "@/components/HeroDemo";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--fd",
  display: "swap",
});
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--fb",
  display: "swap",
});
const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--fm",
  display: "swap",
});

export const metadata = {
  title: "Voxly — AI Sales Call Coaching",
  description:
    "Upload a sales call. Get a coaching score, talk-ratio breakdown, objection log, and AI feedback in 90 seconds. Starting at $49/user/month.",
};

export default function LandingPage() {
  return (
    <div className={`${jakarta.variable} ${dmSans.variable} ${spaceMono.variable}`}>
      <style>{`
        /* ── tokens ── */
        :root {
          --bg:       #F5F4FF;
          --bg-alt:   #EDEAFF;
          --surface:  #FFFFFF;
          --ink:      #0D0B1F;
          --ink-2:    #3C3860;
          --muted:    #7570A0;
          --border:   rgba(79,70,229,.10);
          --accent:   #4F46E5;
          --accent-2: #06B6D4;
          --adim:     rgba(79,70,229,.09);
          --adim-2:   rgba(6,182,212,.09);
          --radius:   12px;
          --fd: 'Plus Jakarta Sans', system-ui, sans-serif;
          --fb: 'DM Sans', system-ui, sans-serif;
          --fm: 'Space Mono', monospace;
        }
        @media (prefers-color-scheme: dark) {
          :root:not([data-theme="light"]) {
            --bg:      #07061A;
            --bg-alt:  #0E0C2B;
            --surface: #110F28;
            --ink:     #EDEAFF;
            --ink-2:   #B2ADDA;
            --muted:   #6D6A96;
            --border:  rgba(140,130,210,.13);
            --accent:  #6366F1;
            --accent-2:#22D3EE;
            --adim:    rgba(99,102,241,.11);
            --adim-2:  rgba(34,211,238,.09);
          }
        }
        :root[data-theme="dark"] {
          --bg:#07061A; --bg-alt:#0E0C2B; --surface:#110F28;
          --ink:#EDEAFF; --ink-2:#B2ADDA; --muted:#6D6A96;
          --border:rgba(140,130,210,.13);
          --accent:#6366F1; --accent-2:#22D3EE;
          --adim:rgba(99,102,241,.11); --adim-2:rgba(34,211,238,.09);
        }

        /* ── reset ── */
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html{scroll-behavior:smooth}
        body{background:var(--bg);color:var(--ink);font-family:var(--fb);line-height:1.6;-webkit-font-smoothing:antialiased}
        a{text-decoration:none;color:inherit}

        /* ── layout ── */
        .wrap{max-width:1120px;margin:0 auto;padding:0 28px}

        /* ── nav ── */
        nav{position:sticky;top:0;z-index:100;background:color-mix(in srgb,var(--bg) 88%,transparent);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);padding:14px 0}
        .nav-inner{display:flex;align-items:center;justify-content:space-between;gap:16px}
        .nav-logo{display:flex;align-items:center;gap:9px}
        .logo-word{font-family:var(--fd);font-weight:800;font-size:17px;color:var(--ink);letter-spacing:-.03em}
        .nav-links{display:flex;align-items:center;gap:24px}
        .nav-link{font-size:13.5px;color:var(--muted);font-weight:500;transition:color .15s}
        .nav-link:hover{color:var(--ink)}
        .nav-actions{display:flex;align-items:center;gap:10px}
        .btn-ghost{font-size:13.5px;color:var(--ink-2);font-weight:500;padding:7px 14px;border-radius:8px;border:1px solid var(--border);transition:all .15s}
        .btn-ghost:hover{border-color:var(--accent);color:var(--accent)}
        .btn-primary{font-size:13.5px;color:#fff;background:var(--accent);font-weight:600;padding:8px 16px;border-radius:8px;transition:opacity .15s;font-family:var(--fb);border:none;cursor:pointer;display:inline-block}
        .btn-primary:hover{opacity:.88}

        /* ── hero ── */
        .hero{padding:72px 0 56px}
        .hero-inner{display:grid;grid-template-columns:1fr 1fr;gap:56px;align-items:center}
        .eyebrow{display:inline-flex;align-items:center;gap:7px;font-size:11.5px;font-weight:700;color:var(--accent);text-transform:uppercase;letter-spacing:.1em;margin-bottom:18px}
        .eyebrow-dot{width:6px;height:6px;border-radius:50%;background:var(--accent);animation:dot-pulse 2s ease-in-out infinite}
        @keyframes dot-pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.7)}}
        h1{font-family:var(--fd);font-size:clamp(34px,4.2vw,54px);font-weight:800;line-height:1.06;letter-spacing:-.035em;color:var(--ink);text-wrap:balance;margin-bottom:18px}
        .h1-accent{background:linear-gradient(125deg,var(--accent) 30%,var(--accent-2));-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
        .hero-body{font-size:16.5px;color:var(--ink-2);max-width:43ch;line-height:1.68;margin-bottom:30px}
        .hero-ctas{display:flex;gap:11px;align-items:center;flex-wrap:wrap}
        .cta-lg{font-size:15px;padding:13px 26px;border-radius:10px}
        .cta-out{font-size:14.5px;color:var(--ink-2);font-weight:500;padding:12px 22px;border-radius:10px;border:1px solid var(--border);transition:all .15s}
        .cta-out:hover{border-color:var(--accent);color:var(--accent)}
        .hero-note{margin-top:18px;font-size:12.5px;color:var(--muted)}

        /* ── stats strip ── */
        .stats{padding:40px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:80px}
        .stats-inner{display:grid;grid-template-columns:repeat(4,1fr);gap:24px}
        .stat-item{text-align:center}
        .stat-num{font-family:var(--fm);font-size:28px;font-weight:700;color:var(--accent);display:block;margin-bottom:3px}
        .stat-label{font-size:13px;color:var(--muted)}

        /* ── section header ── */
        .sh{text-align:center;margin-bottom:48px}
        .sh h2{font-family:var(--fd);font-size:clamp(26px,3vw,38px);font-weight:800;letter-spacing:-.03em;line-height:1.12;margin-bottom:12px;color:var(--ink);text-wrap:balance}
        .sh-sub{font-size:16px;color:var(--muted);max-width:55ch;margin:0 auto;line-height:1.65}

        /* ── features ── */
        .features{padding:0 0 80px}
        .feat-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}
        .feat-card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:24px}
        .feat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:14px}
        .icon-ind{background:var(--adim)}
        .icon-cyn{background:var(--adim-2)}
        .icon-vio{background:rgba(139,92,246,.1)}
        .feat-card h3{font-family:var(--fd);font-size:15px;font-weight:700;color:var(--ink);margin-bottom:8px}
        .feat-body{font-size:13.5px;color:var(--muted);line-height:1.65}

        /* ── comparison ── */
        .cmp-wrap{overflow-x:auto}
        .cmp-table{width:100%;border-collapse:collapse;font-size:13.5px}
        .cmp-table th{text-align:left;padding:12px 16px;font-size:11px;text-transform:uppercase;letter-spacing:.07em;color:var(--muted);font-weight:600;border-bottom:1px solid var(--border)}
        .cmp-table td{padding:13px 16px;border-bottom:1px solid var(--border);color:var(--ink-2)}
        .cmp-table tr:last-child td{border-bottom:none}
        .col-v{background:var(--adim);font-weight:600;color:var(--ink)}
        .ck{color:var(--accent);margin-right:4px;font-weight:700}
        .xx{color:#f87171;margin-right:4px;font-weight:700}
        .pt{color:var(--muted);font-size:12px}
        section{padding:0 0 80px}

        /* ── pricing ── */
        .price-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px;max-width:720px;margin:0 auto}
        .price-card{background:var(--surface);border:1px solid var(--border);border-radius:16px;padding:28px;position:relative}
        .price-card-pro{border-color:var(--accent)}
        .price-card-found{border-color:var(--accent-2)}
        .price-badge{position:absolute;top:-12px;left:50%;transform:translateX(-50%);font-size:11px;font-weight:700;padding:3px 14px;border-radius:99px;background:var(--accent);color:#fff;white-space:nowrap}
        .price-badge-found{background:var(--accent-2)}
        .price-name{font-family:var(--fd);font-size:18px;font-weight:800;color:var(--ink);margin-bottom:6px}
        .price-desc{font-size:13px;color:var(--muted);margin-bottom:20px;line-height:1.5}
        .price-amount{display:flex;align-items:baseline;gap:6px;margin-bottom:4px}
        .price-dollar{font-family:var(--fm);font-size:38px;font-weight:700;color:var(--ink)}
        .price-dollar-strike{font-family:var(--fm);font-size:22px;font-weight:700;color:var(--muted);text-decoration:line-through;margin-right:2px}
        .price-per{font-size:14px;color:var(--muted)}
        .price-note{font-size:12px;color:var(--muted);margin-bottom:18px;line-height:1.5}
        .price-note strong{color:var(--accent-2);font-weight:600}
        .price-feats{list-style:none;display:flex;flex-direction:column;gap:10px;margin-bottom:26px}
        .price-feats li{font-size:13px;color:var(--ink-2);display:flex;align-items:flex-start;gap:8px}
        .price-feats li::before{content:"✓";color:var(--accent);font-weight:700;font-size:12px;flex-shrink:0;margin-top:2px}
        .btn-price{display:block;text-align:center;padding:12px;border-radius:10px;font-weight:600;font-size:14px;transition:opacity .15s}
        .btn-price-out{border:1px solid var(--border);color:var(--ink-2)}
        .btn-price-out:hover{border-color:var(--accent);color:var(--accent)}
        .btn-price-fill{background:var(--accent);color:#fff}
        .btn-price-fill:hover{opacity:.87}
        .btn-price-found{background:var(--accent-2);color:#fff}
        .btn-price-found:hover{opacity:.87}
        .price-urgency{font-size:11px;color:var(--muted);text-align:center;margin-top:10px}

        /* ── CTA band ── */
        .cta-band{background:linear-gradient(120deg,var(--accent),var(--accent-2));border-radius:20px;padding:56px 48px;text-align:center;margin-bottom:80px}
        .cta-band h2{font-family:var(--fd);font-size:clamp(24px,3vw,36px);font-weight:800;color:#fff;margin-bottom:12px}
        .cta-band .sh-sub{color:rgba(255,255,255,.8)}
        .cta-band-btns{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;margin-top:28px}
        .btn-cta-white{background:#fff;color:var(--accent);font-weight:700;padding:13px 26px;border-radius:10px;font-size:15px;transition:opacity .15s}
        .btn-cta-white:hover{opacity:.9}
        .btn-cta-ghost{color:rgba(255,255,255,.85);border:1px solid rgba(255,255,255,.3);padding:12px 22px;border-radius:10px;font-size:14.5px;font-weight:500;transition:all .15s}
        .btn-cta-ghost:hover{border-color:#fff;color:#fff}

        /* ── footer ── */
        footer{padding:32px 0 40px}
        .foot-inner{display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:16px}
        .foot-copy{font-size:13px;color:var(--muted)}
        .foot-links{display:flex;gap:20px}
        .foot-link{font-size:13px;color:var(--muted);transition:color .15s}
        .foot-link:hover{color:var(--ink)}

        /* ── responsive ── */
        @media(max-width:900px){
          .price-grid{grid-template-columns:1fr}
          .hero-inner{grid-template-columns:1fr;gap:40px}
          .feat-grid{grid-template-columns:1fr}
          .stats-inner{grid-template-columns:repeat(2,1fr)}
          .nav-links{display:none}
          .cta-band{padding:40px 24px}
        }
      `}</style>

      {/* NAV */}
      <nav>
        <div className="wrap">
          <div className="nav-inner">
            <a href="/" className="nav-logo">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="8" fill="#4F46E5" />
                <rect x="7" y="9" width="3" height="10" rx="1.5" fill="white" />
                <rect x="12.5" y="6" width="3" height="16" rx="1.5" fill="white" fillOpacity=".85" />
                <rect x="18" y="11" width="3" height="6" rx="1.5" fill="white" fillOpacity=".6" />
              </svg>
              <span className="logo-word">Voxly</span>
            </a>
            <div className="nav-links">
              <a href="#features" className="nav-link">Features</a>
              <a href="#compare" className="nav-link">Compare</a>
              <a href="#pricing" className="nav-link">Pricing</a>
            </div>
            <div className="nav-actions">
              <a href="/login" className="btn-ghost">Sign in</a>
              <a href="/login" className="btn-primary">Get started</a>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div className="wrap">
        <div className="hero">
          <div className="hero-inner">
            <div>
              <div className="eyebrow">
                <span className="eyebrow-dot" />
                AI Sales Coaching
              </div>
              <h1>
                Know exactly what&apos;s{" "}
                <span className="h1-accent">winning — and losing</span>{" "}
                your deals.
              </h1>
              <p className="hero-body">
                Upload a sales call recording. Voxly transcribes it, scores the rep&apos;s
                performance, surfaces objections and buying signals, and delivers AI coaching
                feedback — in 90 seconds.
              </p>
              <div className="hero-ctas">
                <a href="/login" className="btn-primary cta-lg">Start free — 3 calls on us</a>
                <a href="#features" className="cta-out">See how it works →</a>
              </div>
              <p className="hero-note">No credit card. No sales call. No minimum seat count.</p>
            </div>
            <HeroDemo />
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="wrap">
        <div className="stats">
          <div className="stats-inner">
            <div className="stat-item"><span className="stat-num">&lt;90s</span><span className="stat-label">average turnaround</span></div>
            <div className="stat-item"><span className="stat-num">100%</span><span className="stat-label">of calls transcribed</span></div>
            <div className="stat-item"><span className="stat-num">$0</span><span className="stat-label">to get started</span></div>
            <div className="stat-item"><span className="stat-num">10×</span><span className="stat-label">cheaper than Gong</span></div>
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div className="wrap">
        <section id="features" className="features">
          <div className="sh">
            <h2>Everything your sales team needs.<br />Nothing they don&apos;t.</h2>
            <p className="sh-sub">Six core capabilities — all included in every plan, zero add-ons required.</p>
          </div>
          <div className="feat-grid">
            <div className="feat-card">
              <div className="feat-icon icon-ind">🎙</div>
              <h3>Instant Transcription</h3>
              <p className="feat-body">Upload MP3 or MP4. Voxly returns a clean, searchable transcript in under 90 seconds — speaker-labeled and ready for review.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon icon-ind">📊</div>
              <h3>AI Coaching Score</h3>
              <p className="feat-body">Every call gets a 0–100 coaching score with line-by-line feedback. Reps see exactly where they lost momentum — and how to fix it.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon icon-cyn">📈</div>
              <h3>Buying Signals</h3>
              <p className="feat-body">AI flags every moment the customer signaled genuine interest — so reps know which deals to prioritize and what to reference in follow-up.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon icon-vio">🛡</div>
              <h3>Objection Tracking</h3>
              <p className="feat-body">See every objection raised and how your rep handled it. Spot recurring objections across the team before they become a pattern problem.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon icon-vio">👥</div>
              <h3>Team Performance</h3>
              <p className="feat-body">Compare rep performance by score, win rate, and talk ratio. See who&apos;s improving and who needs attention — at a glance.</p>
            </div>
            <div className="feat-card">
              <div className="feat-icon icon-vio">✅</div>
              <h3>Next Steps Extraction</h3>
              <p className="feat-body">AI pulls every committed next step from the call. No more &quot;I thought they said Tuesday&quot; — it&apos;s in the transcript, with context.</p>
            </div>
          </div>
        </section>
      </div>

      {/* COMPARISON */}
      <div className="wrap">
        <section id="compare">
          <div className="sh">
            <h2>Gong costs $100+/user/month.<br />Voxly starts at $49 — and stays there if you commit annually.</h2>
            <p className="sh-sub">Same core analysis. No enterprise sales process. No annual contract. No minimum seat count.</p>
          </div>
          <div className="cmp-wrap">
            <table className="cmp-table">
              <thead>
                <tr>
                  <th>Feature</th>
                  <th className="col-v">Voxly</th>
                  <th>Gong</th>
                  <th>Chorus</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>AI call transcription</td>
                  <td className="col-v"><span className="ck">✓</span> Included</td>
                  <td><span className="ck">✓</span> Included</td>
                  <td><span className="ck">✓</span> Included</td>
                </tr>
                <tr>
                  <td>Coaching score &amp; feedback</td>
                  <td className="col-v"><span className="ck">✓</span> Included</td>
                  <td><span className="pt">✓ Add-on</span></td>
                  <td><span className="pt">✓ Limited</span></td>
                </tr>
                <tr>
                  <td>Team performance dashboard</td>
                  <td className="col-v"><span className="ck">✓</span> Included</td>
                  <td><span className="ck">✓</span> Included</td>
                  <td><span className="ck">✓</span> Included</td>
                </tr>
                <tr>
                  <td>No minimum seat count</td>
                  <td className="col-v"><span className="ck">✓</span> Any size</td>
                  <td><span className="xx">✗</span> 5+ seats</td>
                  <td><span className="xx">✗</span> 3+ seats</td>
                </tr>
                <tr>
                  <td>No annual contract required</td>
                  <td className="col-v"><span className="ck">✓</span> Month-to-month</td>
                  <td><span className="xx">✗</span> Annual only</td>
                  <td><span className="xx">✗</span> Annual only</td>
                </tr>
                <tr>
                  <td>Starting price / user / month</td>
                  <td className="col-v">$49 intro · $59 monthly</td>
                  <td>$100+</td>
                  <td>$80+</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {/* PRICING */}
      <div className="wrap">
        <section id="pricing">
          <div className="sh">
            <h2>Simple, honest pricing.</h2>
            <p className="sh-sub">Start free. Upgrade when it&apos;s paying for itself.</p>
          </div>
          <div className="price-grid">

            {/* Free */}
            <div className="price-card">
              <div className="price-name">Free Trial</div>
              <div className="price-desc">Try Voxly with your real calls. No card needed.</div>
              <div className="price-amount">
                <span className="price-dollar">$0</span>
                <span className="price-per">forever</span>
              </div>
              <div className="price-note">3 calls, full analysis, 1 user.</div>
              <ul className="price-feats">
                <li>3 call analyses included</li>
                <li>Full transcription &amp; scoring</li>
                <li>Coaching feedback per call</li>
                <li>1 user</li>
              </ul>
              <a href="/login" className="btn-price btn-price-out">Get started free</a>
            </div>

            {/* Pro */}
            <div className="price-card price-card-pro">
              <div className="price-badge">Most popular</div>
              <div className="price-name">Pro</div>
              <div className="price-desc">For growing sales teams who coach on every call.</div>
              <div className="price-amount">
                <span className="price-dollar">$49</span>
                <span className="price-per">/user/month</span>
              </div>
              <div className="price-note">
                Intro rate for your first 3 months, then $59/mo —<br />
                or <strong>lock in $49 forever</strong> with annual billing.
              </div>
              <ul className="price-feats">
                <li>Unlimited call analyses</li>
                <li>Full transcription &amp; AI coaching</li>
                <li>Team performance dashboard</li>
                <li>Invite &amp; manage your reps</li>
                <li>Buying signals &amp; objection log</li>
                <li>Lock in $49/mo annually at any time</li>
              </ul>
              <a href="/login" className="btn-price btn-price-fill">Start Pro free for 14 days</a>
            </div>

          </div>
        </section>
      </div>

      {/* CTA BAND */}
      <div className="wrap">
        <div className="cta-band">
          <h2>Stop guessing what&apos;s working.</h2>
          <p className="sh-sub">Every call your team makes is coaching data. Voxly makes it actionable in 90 seconds.</p>
          <div className="cta-band-btns">
            <a href="/login" className="btn-cta-white">Start free — 3 calls on us</a>
            <a href="#features" className="btn-cta-ghost">See how it works</a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="wrap">
        <footer>
          <div className="foot-inner">
            <div className="foot-copy">© 2026 Voxly · Applied Intelligence Holdings</div>
            <div className="foot-links">
              <a href="/login" className="foot-link">Sign in</a>
              <a href="#pricing" className="foot-link">Pricing</a>
              <a href="mailto:rick@applied-intelholdings.net" className="foot-link">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
