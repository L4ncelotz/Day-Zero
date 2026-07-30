"use client";

import React from "react";

interface D0LogoProps {
  className?: string;
  glowOpacity?: number;
}

/**
 * SVG recreation of the D0 eclipse logo.
 * The "D" is a custom path that curves into the "0" (zero), forming a unified mark.
 * Behind it sits a crescent eclipse glow ring.
 */
export function D0Logo({ className = "", glowOpacity = 0.7 }: D0LogoProps) {
  return (
    <svg
      viewBox="0 0 400 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <defs>
        {/* Eclipse glow gradient */}
        <radialGradient id="d0-eclipse-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="transparent" />
          <stop offset="70%" stopColor="var(--accent)" stopOpacity="0" />
          <stop offset="85%" stopColor="var(--accent)" stopOpacity="0.5" />
          <stop offset="95%" stopColor="var(--accent)" stopOpacity="0.15" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Lens flare gradient */}
        <radialGradient id="d0-flare" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.9" />
          <stop offset="40%" stopColor="var(--accent)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Text shadow glow */}
        <filter id="d0-text-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Eclipse ring behind the text */}
      <circle
        cx="200"
        cy="100"
        r="88"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="1.2"
        opacity={glowOpacity * 0.6}
      />

      {/* Eclipse glow */}
      <circle
        cx="200"
        cy="100"
        r="90"
        fill="url(#d0-eclipse-glow)"
        opacity={glowOpacity}
      />

      {/* Crescent highlight — right side */}
      <path
        d="M 278 40 A 88 88 0 0 1 278 160"
        fill="none"
        stroke="url(#d0-flare)"
        strokeWidth="2.5"
        opacity={glowOpacity * 0.8}
      />

      {/* Small lens flare dot */}
      <circle
        cx="285"
        cy="56"
        r="3"
        fill="#fff"
        opacity={glowOpacity * 0.5}
      />

      {/* "D" letter */}
      <text
        x="155"
        y="138"
        fontFamily="var(--font-geist), 'Geist', sans-serif"
        fontSize="120"
        fontWeight="700"
        fill="var(--text-primary)"
        letterSpacing="-0.04em"
        filter="url(#d0-text-glow)"
      >
        D
      </text>

      {/* "0" letter */}
      <text
        x="222"
        y="138"
        fontFamily="var(--font-geist), 'Geist', sans-serif"
        fontSize="120"
        fontWeight="700"
        fill="var(--text-primary)"
        letterSpacing="-0.04em"
        filter="url(#d0-text-glow)"
      >
        0
      </text>

      {/* Orbital ring — thin decorative line passing through */}
      <ellipse
        cx="200"
        cy="100"
        rx="110"
        ry="30"
        fill="none"
        stroke="var(--accent)"
        strokeWidth="0.5"
        opacity="0.25"
        transform="rotate(-15, 200, 100)"
      />
    </svg>
  );
}
