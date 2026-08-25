"use client";

interface VoxlyLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function VoxlyLogo({ size = 32, showText = true, className = "" }: VoxlyLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="voxly-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7B7FF5" />
            <stop offset="100%" stopColor="#00C8D4" />
          </linearGradient>
          <linearGradient id="wave-left-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#9090F8" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#9090F8" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="wave-right-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00C8D4" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#00C8D4" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        {/* Left signal waves — top-left corner */}
        <path d="M14 26 Q8 20 14 14" stroke="url(#wave-left-grad)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M19 31 Q9 22 19 13" stroke="url(#wave-left-grad)" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.6"/>

        {/* Right signal waves — top-right corner */}
        <path d="M86 26 Q92 20 86 14" stroke="url(#wave-right-grad)" strokeWidth="3.5" strokeLinecap="round" fill="none"/>
        <path d="M81 31 Q91 22 81 13" stroke="url(#wave-right-grad)" strokeWidth="3" strokeLinecap="round" fill="none" strokeOpacity="0.6"/>

        {/* V shape */}
        <path
          d="M10 12 L50 80 L90 12 L78 12 L50 62 L22 12 Z"
          fill="url(#voxly-grad)"
        />

        {/* Dot at bottom tip */}
        <circle cx="50" cy="82" r="5" fill="url(#voxly-grad)" />
        <circle cx="50" cy="82" r="8" fill="url(#voxly-grad)" fillOpacity="0.25" />
      </svg>

      {showText && (
        <span
          className="font-bold tracking-tight"
          style={{
            fontSize: size * 0.55,
            background: "linear-gradient(90deg, #7B7FF5, #00C8D4)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          voxly
        </span>
      )}
    </div>
  );
}
