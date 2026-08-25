"use client";

import { useTheme } from "./ThemeProvider";

const options = [
  { value: "dark",   label: "Dark",   icon: "🌙" },
  { value: "light",  label: "Light",  icon: "☀️" },
  { value: "system", label: "System", icon: "💻" },
] as const;

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const current = options.find((o) => o.value === theme) ?? options[0];

  const cycle = () => {
    const idx = options.findIndex((o) => o.value === theme);
    const next = options[(idx + 1) % options.length];
    setTheme(next.value);
  };

  return (
    <button
      onClick={cycle}
      title={`Theme: ${current.label} — click to switch`}
      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm w-full text-left transition-colors hover:bg-gray-800"
      style={{ color: "var(--vx-muted)" }}
    >
      <span className="text-base">{current.icon}</span>
      <span>{current.label}</span>
    </button>
  );
}
