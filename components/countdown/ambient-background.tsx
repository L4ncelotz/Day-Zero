"use client";

import React, { useEffect, useState } from "react";

interface AmbientBackgroundProps {
  stage: string;
  reducedMotion?: boolean;
}

export function AmbientBackground({ stage, reducedMotion = false }: AmbientBackgroundProps) {
  const [pointerOffset, setPointerOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (reducedMotion) return;
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (isTouch) return;

    let animationFrameId: number;

    const handleMouseMove = (e: MouseEvent) => {
      animationFrameId = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 28;
        const y = (e.clientY / window.innerHeight - 0.5) * 28;
        setPointerOffset({ x, y });
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [reducedMotion]);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-background">
      {/* Radial Ambient Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] max-w-[900px] h-[70vw] max-h-[900px] rounded-full blur-[130px] opacity-25 transition-all duration-1000 ease-out"
        style={{
          background: `radial-gradient(circle, var(--accent) 0%, var(--accent-secondary) 50%, transparent 75%)`,
          transform: reducedMotion
            ? "translate(-50%, -50%)"
            : `translate(calc(-50% + ${pointerOffset.x}px), calc(-50% + ${pointerOffset.y}px))`,
        }}
      />

      {/* Secondary Glow Blob */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] max-w-[500px] h-[40vw] max-h-[500px] rounded-full blur-[90px] opacity-15"
        style={{
          background: `radial-gradient(circle, var(--accent-secondary) 0%, transparent 80%)`,
          transform: reducedMotion
            ? "translate(-50%, -50%)"
            : `translate(calc(-50% - ${pointerOffset.x * 0.5}px), calc(-50% - ${pointerOffset.y * 0.5}px))`,
        }}
      />

      {/* Subtle Grain Overlay */}
      <div className="absolute inset-0 bg-grain pointer-events-none opacity-40 mix-blend-overlay" />
    </div>
  );
}
