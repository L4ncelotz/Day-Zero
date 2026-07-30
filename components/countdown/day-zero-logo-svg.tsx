import React from "react";

interface DayZeroLogoSvgProps extends React.SVGProps<SVGSVGElement> {
  glowColor?: string;
  className?: string;
}

export function DayZeroLogoSvg({
  glowColor = "var(--accent, #a78bfa)",
  className = "",
  ...props
}: DayZeroLogoSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 240 100"
      className={`w-full h-auto drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] ${className}`}
      {...props}
    >
      <defs>
        <filter id="endpoint-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur1" />
          <feGaussianBlur stdDeviation="8" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="gradient-stroke" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
          <stop offset="100%" stopColor="#d1d5db" stopOpacity="0.75" />
        </linearGradient>
      </defs>

      {/* The D */}
      <path
        d="M 40 20 L 80 20 C 110 20, 125 40, 125 50 C 125 60, 110 80, 80 80 L 40 80 Z"
        fill="none"
        stroke="url(#gradient-stroke)"
        strokeWidth="14"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />

      {/* The Narrow 0 with an upper-right break */}
      {/* We use a specific path with a gap at the top right */}
      <path
        d="M 175 20 C 150 20, 140 35, 140 50 C 140 65, 150 80, 175 80 C 200 80, 210 65, 210 50 C 210 38, 203 26, 188 22"
        fill="none"
        stroke="url(#gradient-stroke)"
        strokeWidth="14"
        strokeLinecap="round"
      />
      {/* Glowing Endpoint at the break */}
      <circle
        cx="188"
        cy="22"
        r="7"
        fill="#ffffff"
        filter="url(#endpoint-glow)"
      />
      {/* Dynamic color glow behind the endpoint */}
      <circle
        cx="188"
        cy="22"
        r="12"
        fill={glowColor}
        opacity="0.6"
        filter="url(#endpoint-glow)"
        className="mix-blend-screen"
      />
    </svg>
  );
}
