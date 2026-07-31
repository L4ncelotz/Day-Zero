"use client";

import React, { useEffect, useState, ReactNode } from "react";

interface GlitchTextProps {
  children: ReactNode;
  text: string;
  className?: string;
  active?: boolean;
}

export function GlitchText({ children, text, className = "", active = false }: GlitchTextProps) {
  const [isGlitching, setIsGlitching] = useState(active);

  // Randomly glitch every few seconds for a short duration
  useEffect(() => {
    if (active) return; // If controlled externally, don't use internal timer

    const glitchInterval = setInterval(() => {
      // 15% chance to glitch every 2 seconds
      if (Math.random() > 0.85) {
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 200 + Math.random() * 400);
      }
    }, 2000);

    return () => clearInterval(glitchInterval);
  }, [active]);

  return (
    <span
      className={`glitch-wrapper ${isGlitching || active ? "is-glitching" : ""} ${className}`}
    >
      <span className="glitch-text relative inline-block" data-text={text}>
        {children}
      </span>
    </span>
  );
}
