"use client";

interface VoxlyLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function VoxlyLogo({ size = 32, showText = true, className = "" }: VoxlyLogoProps) {
  const h = size;
  const w = size * 0.85;

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <svg width={w} height={h} viewBox="0 0 85 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="leftFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="rightFace" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        {/* Left face of V */}
        <polygon points="5,8 38,8 42.5,92 20,92" fill="url(#leftFace)" opacity="0.95" />
        {/* Right face of V */}
        <polygon points="47,8 80,8 65,92 42.5,92" fill="url(#rightFace)" opacity="0.9" />
        {/* Signal arc left */}
        <path d="M 15 30 Q 10 50 15 70" stroke="#a5b4fc" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 10 22 Q 2 50 10 78" stroke="#a5b4fc" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
        {/* Signal arc right */}
        <path d="M 70 30 Q 75 50 70 70" stroke="#67e8f9" strokeWidth="2.5" fill="none" strokeLinecap="round" opacity="0.7" />
        <path d="M 75 22 Q 83 50 75 78" stroke="#67e8f9" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.4" />
        {/* Glow dot at tip */}
        <circle cx="42.5" cy="92" r="4" fill="#60a5fa" filter="url(#glow)" />
      </svg>
      {showText && (
        <span className="text-white font-bold tracking-tight" style={{ fontSize: size * 0.55 }}>
          voxly
        </span>
      )}
    </div>
  );
}
