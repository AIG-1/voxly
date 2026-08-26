"use client";

import { useEffect, useRef, useState } from "react";

type Phase = {
  pct: number;
  text: string;
  status: string;
  done: boolean;
};

const PHASES: Phase[] = [
  { pct: 18,  text: "Uploading audio",    status: "Uploading…",    done: false },
  { pct: 52,  text: "Transcribing speech", status: "Transcribing…", done: false },
  { pct: 85,  text: "AI analysis running", status: "Analyzing…",    done: false },
  { pct: 100, text: "Analysis complete",  status: "✓ Complete",    done: true  },
];

const PHASE_DELAYS = [1400, 1600, 1800, 0]; // ms before advancing to next phase

export default function HeroDemo() {
  const [phaseIdx, setPhaseIdx] = useState(-1); // -1 = pre-start
  const [score, setScore] = useState<number | null>(null);
  const [barsVisible, setBarsVisible] = useState(false);
  const [topicsVisible, setTopicsVisible] = useState([false, false, false, false]);
  const [fbVisible, setFbVisible] = useState(false);
  const [outcomeVisible, setOutcomeVisible] = useState(false);

  const scoreRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const cycleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function reset() {
    setPhaseIdx(-1);
    setScore(null);
    setBarsVisible(false);
    setTopicsVisible([false, false, false, false]);
    setFbVisible(false);
    setOutcomeVisible(false);
    if (scoreRef.current) clearInterval(scoreRef.current);
  }

  function animateScore(target: number, duration: number) {
    let current = 0;
    const step = target / (duration / 40);
    if (scoreRef.current) clearInterval(scoreRef.current);
    scoreRef.current = setInterval(() => {
      current = Math.min(current + step, target);
      setScore(Math.round(current));
      if (current >= target) {
        clearInterval(scoreRef.current!);
        scoreRef.current = null;
      }
    }, 40);
  }

  function runPhase(idx: number) {
    if (idx >= PHASES.length) {
      // Show results for 5s, then loop
      cycleRef.current = setTimeout(() => {
        reset();
        cycleRef.current = setTimeout(() => runPhase(0), 800);
      }, 5000);
      return;
    }

    setPhaseIdx(idx);

    if (idx === 3) {
      // Reveal results
      setTimeout(() => animateScore(82, 1200), 200);
      setTimeout(() => setBarsVisible(true), 600);
      [0, 1, 2, 3].forEach((i) => {
        setTimeout(() => {
          setTopicsVisible((prev) => {
            const next = [...prev];
            next[i] = true;
            return next;
          });
        }, 1000 + i * 200);
      });
      setTimeout(() => setFbVisible(true), 2000);
      setTimeout(() => setOutcomeVisible(true), 2400);
    }

    const delay = PHASE_DELAYS[idx];
    if (delay > 0) {
      cycleRef.current = setTimeout(() => runPhase(idx + 1), delay);
    } else {
      runPhase(idx + 1);
    }
  }

  useEffect(() => {
    const t = setTimeout(() => runPhase(0), 600);
    return () => {
      clearTimeout(t);
      if (cycleRef.current) clearTimeout(cycleRef.current);
      if (scoreRef.current) clearInterval(scoreRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phase = phaseIdx >= 0 ? PHASES[phaseIdx] : PHASES[0];
  const pct = phaseIdx >= 0 ? phase.pct : 0;
  const isDone = phaseIdx === 3;

  const TOPICS = ["Pricing", "ROI questions", "Timeline", "Contract terms"];

  return (
    <div style={{ position: "relative" }}>
      {/* Glow */}
      <div style={{
        position: "absolute", inset: "-24px", borderRadius: "32px",
        background: "radial-gradient(ellipse at 60% 40%, rgba(99,102,241,.15) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      <div style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 8px 32px rgba(0,0,0,.07), 0 1px 4px rgba(0,0,0,.04)",
        position: "relative",
      }}>
        {/* Card header */}
        <div style={{
          padding: "14px 18px",
          borderBottom: "1px solid var(--border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--bg-alt)",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fbbf24" }} />
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#34d399" }} />
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--muted)", fontFamily: "var(--fm)" }}>
              Q4_enterprise_call.mp3
            </span>
          </div>
          <span style={{
            fontSize: 11,
            padding: "3px 10px",
            borderRadius: 99,
            background: isDone ? "rgba(52,211,153,.15)" : "rgba(99,102,241,.12)",
            color: isDone ? "#34d399" : "var(--accent)",
            fontWeight: 600,
            transition: "all .4s",
          }}>
            {phaseIdx >= 0 ? phase.status : "Analyzing…"}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ padding: "16px 18px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--muted)", marginBottom: 6 }}>
            <span style={{ transition: "opacity .3s" }}>
              {phaseIdx >= 0 ? phase.text : "Processing audio"}
            </span>
            <span style={{ fontFamily: "var(--fm)" }}>{pct}%</span>
          </div>
          <div style={{ background: "var(--bg-alt)", borderRadius: 99, height: 6, overflow: "hidden" }}>
            <div style={{
              height: "100%",
              borderRadius: 99,
              background: "linear-gradient(90deg, var(--accent), var(--accent-2))",
              width: `${pct}%`,
              transition: "width .8s cubic-bezier(.4,0,.2,1)",
            }} />
          </div>
        </div>

        {/* Results grid */}
        <div style={{ padding: "18px 18px 0", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {/* Score */}
          <div style={{
            background: "var(--adim)",
            borderRadius: 12,
            padding: "14px 16px",
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted)", fontWeight: 600 }}>
              Coaching Score
            </span>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontFamily: "var(--fm)", fontSize: 32, fontWeight: 700, color: "var(--accent)", lineHeight: 1 }}>
                {score !== null ? score : "—"}
              </span>
              <span style={{
                fontFamily: "var(--fm)", fontSize: 14, color: "var(--muted)",
                opacity: score !== null ? 1 : 0,
                transition: "opacity .4s",
              }}>/100</span>
            </div>
          </div>

          {/* Talk ratio */}
          <div style={{ background: "var(--adim-2)", borderRadius: 12, padding: "14px 16px" }}>
            <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: 10 }}>
              Talk Ratio
            </span>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 40 }}>
              {/* Rep bar */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--fm)", opacity: barsVisible ? 1 : 0, transition: "opacity .4s" }}>
                  {barsVisible ? "47%" : "—"}
                </span>
                <div style={{ width: "100%", height: 32, display: "flex", alignItems: "flex-end", background: "var(--bg-alt)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: "100%",
                    height: barsVisible ? "47%" : "0%",
                    background: "var(--accent)",
                    transition: "height .8s cubic-bezier(.4,0,.2,1)",
                    borderRadius: 4,
                  }} />
                </div>
                <span style={{ fontSize: 9, color: "var(--muted)" }}>Rep</span>
              </div>
              {/* Customer bar */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 10, color: "var(--muted)", fontFamily: "var(--fm)", opacity: barsVisible ? 1 : 0, transition: "opacity .4s" }}>
                  {barsVisible ? "53%" : "—"}
                </span>
                <div style={{ width: "100%", height: 32, display: "flex", alignItems: "flex-end", background: "var(--bg-alt)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{
                    width: "100%",
                    height: barsVisible ? "53%" : "0%",
                    background: "var(--accent-2)",
                    transition: "height .8s cubic-bezier(.4,0,.2,1)",
                    borderRadius: 4,
                  }} />
                </div>
                <span style={{ fontSize: 9, color: "var(--muted)" }}>Customer</span>
              </div>
            </div>
          </div>
        </div>

        {/* Topics */}
        <div style={{ padding: "14px 18px 0" }}>
          <span style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: ".08em", color: "var(--muted)", fontWeight: 600, display: "block", marginBottom: 8 }}>
            Topics
          </span>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {TOPICS.map((topic, i) => (
              <span key={i} style={{
                fontSize: 11,
                padding: "3px 10px",
                borderRadius: 99,
                background: "var(--adim)",
                color: "var(--accent)",
                border: "1px solid var(--border)",
                opacity: topicsVisible[i] ? 1 : 0,
                transform: topicsVisible[i] ? "translateY(0)" : "translateY(4px)",
                transition: "opacity .3s, transform .3s",
              }}>
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Feedback */}
        <div style={{
          margin: "14px 18px 0",
          padding: "12px 14px",
          background: "var(--bg-alt)",
          borderRadius: 10,
          opacity: fbVisible ? 1 : 0,
          transform: fbVisible ? "translateY(0)" : "translateY(6px)",
          transition: "opacity .4s, transform .4s",
        }}>
          <span style={{ fontSize: 10, fontWeight: 700, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".08em", display: "block", marginBottom: 5 }}>
            🎯 Coaching
          </span>
          <p style={{ fontSize: 12, color: "var(--ink-2)", lineHeight: 1.55, margin: 0 }}>
            Strong discovery — rep let the customer set the pace. Price objection handled cleanly with TCO framing. Push for a concrete follow-up date earlier.
          </p>
        </div>

        {/* Outcome */}
        <div style={{ padding: "12px 18px 16px", display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{
            fontSize: 12,
            padding: "4px 12px",
            borderRadius: 99,
            background: "rgba(52,211,153,.15)",
            color: "#34d399",
            fontWeight: 600,
            opacity: outcomeVisible ? 1 : 0,
            transition: "opacity .4s",
          }}>
            ✓ Won
          </span>
          <span style={{
            fontSize: 12,
            color: "var(--muted)",
            opacity: outcomeVisible ? 1 : 0,
            transition: "opacity .4s .1s",
          }}>
            📈 Requested contract
          </span>
        </div>
      </div>
    </div>
  );
}
