"use client";

import React from "react";
import Image from "next/image";

interface D0LogoProps {
  className?: string;
  glowOpacity?: number;
}

export function D0Logo({ className = "" }: D0LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <Image
        src="/logo/day-zero-logo.png"
        alt="DAY ZERO logo"
        width={420}
        height={220}
        priority
        className="w-[clamp(220px,28vw,420px)] h-auto object-contain pointer-events-none"
      />
    </div>
  );
}
