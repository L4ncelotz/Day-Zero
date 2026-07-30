"use client";

import React from "react";
import { motion, MotionValue, useMotionValue, useTransform } from "motion/react";

interface AmbientBackgroundProps {
  stage: string;
  reducedMotion?: boolean;
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
}

export function AmbientBackground({ stage, reducedMotion = false, pointerX, pointerY }: AmbientBackgroundProps) {
  const fallbackX = useMotionValue(0);
  const fallbackY = useMotionValue(0);

  const x = pointerX ?? fallbackX;
  const y = pointerY ?? fallbackY;

  // Parallax constraints: Background glow: 10–18px
  // Main glow (up to 18px)
  const translateX1 = useTransform(x, [-1, 1], [-18, 18]);
  const translateY1 = useTransform(y, [-1, 1], [-18, 18]);
  
  // Secondary glow (moves oppositely, up to 10px)
  const translateX2 = useTransform(x, [-1, 1], [10, -10]);
  const translateY2 = useTransform(y, [-1, 1], [10, -10]);

  return (
    <div className={`fixed inset-0 pointer-events-none overflow-hidden z-0 transition-colors duration-2000 ${stage === "completed" ? "bg-[#0b0c16]" : "bg-background"}`}>
      {/* Dawn Tone overlay on completion */}
      <div 
        className={`absolute inset-0 transition-opacity duration-[3000ms] ease-out mix-blend-screen ${stage === "completed" ? "opacity-30" : "opacity-0"} bg-[radial-gradient(ellipse_at_bottom,#4c1d95_0%,#0f172a_60%,transparent_100%)]`}
      />

      {/* Radial Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-[70vw] max-w-[900px] h-[70vw] max-h-[900px] rounded-full blur-[130px] opacity-25 transition-colors duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, var(--accent) 0%, var(--accent-secondary) 50%, transparent 75%)`,
            x: reducedMotion ? 0 : translateX1,
            y: reducedMotion ? 0 : translateY1,
          }}
        />
      </div>

      {/* Secondary Glow Blob */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <motion.div
          className="w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] rounded-full blur-[90px] opacity-15 transition-colors duration-1000 ease-out"
          style={{
            background: `radial-gradient(circle, var(--accent-secondary) 0%, transparent 80%)`,
            x: reducedMotion ? 0 : translateX2,
            y: reducedMotion ? 0 : translateY2,
          }}
        />
      </div>

      {/* Subtle Grain Overlay (Foreground grain: 0px parallax) */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
}
