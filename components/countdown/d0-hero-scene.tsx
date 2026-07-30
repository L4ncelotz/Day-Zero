"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import Image from "next/image";

interface D0HeroSceneProps {
  reducedMotion?: boolean;
}

export function D0HeroScene({ reducedMotion = false }: D0HeroSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse motion values normalized to [-1, 1]
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for 3D tilt & parallax (Awwwards 60fps feel)
  const springConfig = { damping: 25, stiffness: 120, mass: 0.6 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  // 3D rotations for the emblem (Max ~12 degrees)
  const rotateX = useTransform(smoothY, [-1, 1], [12, -12]);
  const rotateY = useTransform(smoothX, [-1, 1], [-14, 14]);

  // Deep layers move oppositely for parallax depth
  const bgTranslateX = useTransform(smoothX, [-1, 1], [-25, 25]);
  const bgTranslateY = useTransform(smoothY, [-1, 1], [-25, 25]);
  const fgTranslateX = useTransform(smoothX, [-1, 1], [20, -20]);
  const fgTranslateY = useTransform(smoothY, [-1, 1], [20, -20]);

  // Dynamic light glare position on emblem
  const glareX = useTransform(smoothX, [-1, 1], [20, 80]);
  const glareY = useTransform(smoothY, [-1, 1], [20, 80]);

  useEffect(() => {
    if (reducedMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      mouseX.set(Math.max(-1, Math.min(1, x)));
      mouseY.set(Math.max(-1, Math.min(1, y)));
    };

    const handleMouseLeave = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reducedMotion, mouseX, mouseY]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[550px] aspect-square flex items-center justify-center pointer-events-auto select-none"
      style={{ perspective: 1200 }}
    >
      {/* Layer 1: Ambient Deep Space Blue/Purple Nebula */}
      <motion.div
        style={{
          x: bgTranslateX,
          y: bgTranslateY,
        }}
        className="absolute inset-[-10%] rounded-full blur-[90px] opacity-40 pointer-events-none"
        aria-hidden="true"
      >
        <div className="w-full h-full bg-[radial-gradient(circle_at_60%_40%,#6366f1_0%,#3b82f6_35%,#0f172a_70%,transparent_100%)]" />
      </motion.div>

      {/* Layer 2: Horizontal Lens Flare Beam */}
      <motion.div
        style={{
          x: bgTranslateX,
          y: bgTranslateY,
        }}
        className="absolute w-[140%] h-[2px] bg-[linear-gradient(90deg,transparent_0%,rgba(147,197,253,0.1)_20%,rgba(191,219,254,0.9)_50%,rgba(147,197,253,0.1)_80%,transparent_100%)] blur-[1px] pointer-events-none z-0"
        aria-hidden="true"
      />

      {/* Layer 3: Main 3D Interactive Eclipse Planet Container */}
      <motion.div
        style={{
          rotateX: reducedMotion ? 0 : rotateX,
          rotateY: reducedMotion ? 0 : rotateY,
          transformStyle: "preserve-3d",
        }}
        className="relative w-[80%] h-[80%] flex items-center justify-center transform-gpu"
      >
        {/* Eclipse Rim Aura Glow */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 75% 35%, rgba(147, 197, 253, 0.45) 0%, rgba(99, 102, 241, 0.25) 45%, transparent 70%)",
            filter: "blur(25px)",
          }}
          aria-hidden="true"
        />

        {/* Tilted Orbital Ring */}
        <div
          className="absolute w-[115%] h-[115%] rounded-full border border-blue-400/25 pointer-events-none"
          style={{
            transform: "rotateX(72deg) rotateY(-18deg) translateZ(-10px)",
            boxShadow: "0 0 15px rgba(99, 102, 241, 0.15)",
          }}
          aria-hidden="true"
        />

        {/* Dark Eclipse Sphere Body */}
        <div
          className="relative w-full h-full rounded-full overflow-hidden shadow-[0_0_80px_rgba(0,0,0,0.9)] border border-white/10"
          style={{
            background: "radial-gradient(circle at 35% 35%, #0d121d 0%, #05070c 70%, #020305 100%)",
            transform: "translateZ(0px)",
          }}
        >
          {/* Intense Right Crescent Light Corona */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 82% 42%, rgba(219, 234, 254, 0.95) 0%, rgba(147, 197, 253, 0.8) 18%, rgba(99, 102, 241, 0.5) 35%, transparent 60%)",
              mixBlendMode: "screen",
            }}
          />

          {/* Inner Dark Mask for Sharp Eclipse Crescent Effect */}
          <div
            className="absolute inset-[3px] rounded-full"
            style={{
              background: "radial-gradient(circle at 32% 38%, #090d16 0%, #04060a 75%, #010203 100%)",
            }}
          />

          {/* Dynamic Specular Light Glare tracking mouse */}
          {!reducedMotion && (
            <motion.div
              className="absolute inset-0 pointer-events-none opacity-25 mix-blend-overlay"
              style={{
                background: useTransform(
                  [glareX, glareY],
                  ([x, y]) => `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.8) 0%, transparent 60%)`
                ),
              }}
            />
          )}

          {/* Layer 4: Real D0 Brand Logo Asset (Elevated in 3D Space) */}
          <motion.div
            style={{
              x: fgTranslateX,
              y: fgTranslateY,
              transform: "translateZ(45px)",
            }}
            className="absolute inset-0 flex items-center justify-center p-6 z-10"
          >
            <Image
              src="/logo/day-zero-logo.png"
              alt="DAY ZERO logo"
              width={420}
              height={220}
              priority
              className="w-[clamp(220px,28vw,420px)] h-auto object-contain pointer-events-none"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
