"use client";

import Image from "next/image";

interface VoxlyLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export default function VoxlyLogo({ size = 32, showText = true, className = "" }: VoxlyLogoProps) {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/voxlylogo.png"
        alt="Voxly"
        width={size}
        height={size}
        style={{ objectFit: "contain" }}
      />
      {showText && (
        <span className="text-white font-bold tracking-tight" style={{ fontSize: size * 0.55 }}>
          voxly
        </span>
      )}
    </div>
  );
}
