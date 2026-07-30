"use client";

import React from "react";
import { DayZeroLogoSvg } from "./day-zero-logo-svg";

interface D0LogoProps {
  className?: string;
  glowOpacity?: number;
}

export function D0Logo({ className = "" }: D0LogoProps) {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <DayZeroLogoSvg className="w-[clamp(220px,28vw,420px)] pointer-events-none" />
    </div>
  );
}
