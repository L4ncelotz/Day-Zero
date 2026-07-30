"use client";

import React, { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useAnimationFrame } from "motion/react";

interface CinematicOrbitProps {
  progress: number;
  urgency: 0 | 1 | 2 | 3;
  completed: boolean;
  reducedMotion: boolean;
  pointerX?: import("motion/react").MotionValue<number>;
  pointerY?: import("motion/react").MotionValue<number>;
}

export function CinematicOrbit({
  progress,
  urgency,
  completed,
  reducedMotion,
  pointerX,
  pointerY,
}: CinematicOrbitProps) {
  // 1. Mouse Parallax Constraints
  const springConfig = { damping: 25, stiffness: 150, mass: 0.5 };
  
  // Use provided centralized pointers, fallback to 0 if not provided
  const dummyX = useMotionValue(0);
  const dummyY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX || dummyX, springConfig);
  const smoothPointerY = useSpring(pointerY || dummyY, springConfig);

  // Transform mouse values to 3D rotation degrees and 2D translations
  // Outer layer: strongest movement (up to 5 deg rotation, 8px translation)
  const rotateXOuter = useTransform(smoothPointerY, [-1, 1], [-5, 5]);
  const rotateYOuter = useTransform(smoothPointerX, [-1, 1], [5, -5]);
  const translateXOuter = useTransform(smoothPointerX, [-1, 1], [-8, 8]);
  const translateYOuter = useTransform(smoothPointerY, [-1, 1], [-8, 8]);
  
  // Inner layer: medium movement (up to 3 deg rotation, 5px translation)
  const rotateXInner = useTransform(smoothPointerY, [-1, 1], [-3, 3]);
  const rotateYInner = useTransform(smoothPointerX, [-1, 1], [3, -3]);
  const translateXInner = useTransform(smoothPointerX, [-1, 1], [-5, 5]);
  const translateYInner = useTransform(smoothPointerY, [-1, 1], [-5, 5]);

  // Progress layer: minimal movement (up to 1.5 deg rotation, 2px translation)
  const rotateXProgress = useTransform(smoothPointerY, [-1, 1], [-1.5, 1.5]);
  const rotateYProgress = useTransform(smoothPointerX, [-1, 1], [1.5, -1.5]);
  const translateXProgress = useTransform(smoothPointerX, [-1, 1], [-2, 2]);
  const translateYProgress = useTransform(smoothPointerY, [-1, 1], [-2, 2]);

  // 2. Continuous Rotation (Time-based)
  const time = useMotionValue(0);
  
  useAnimationFrame((t, delta) => {
    if (reducedMotion || document.hidden) return;
    
    // Urgency behaviour for speed
    const baseSpeeds = [0.015, 0.02, 0.03, 0.04];
    const currentSpeed = completed ? 0.005 : baseSpeeds[urgency];
    
    time.set(time.get() + currentSpeed * delta);
  });

  const continuousRotateZ1 = useTransform(time, (v) => v % 360);
  const continuousRotateZ2 = useTransform(time, (v) => -(v * 0.8) % 360);
  const continuousRotateZ3 = useTransform(time, (v) => (v * 1.2) % 360);

  // 3. Progress Calculation
  const radius = 85;
  const circumference = 2 * Math.PI * radius;
  const clampedProgress = Math.max(0, Math.min(100, progress));
  const strokeDashoffset = circumference - (clampedProgress / 100) * circumference;
  const angle = (clampedProgress / 100) * 360;

  // 4. Urgency Visuals (Glow and Pulse)
  let glowOpacity = 0.3;
  let pulseDuration = 0;
  
  if (completed) {
    glowOpacity = 0.8;
  } else if (urgency === 0) {
    glowOpacity = 0.25;
  } else if (urgency === 1) {
    glowOpacity = 0.4;
  } else if (urgency === 2) {
    glowOpacity = 0.6;
    pulseDuration = 3;
  } else if (urgency === 3) {
    glowOpacity = 0.85;
    pulseDuration = 1.5;
  }

  const pulseVariant: any = !reducedMotion && pulseDuration > 0 && !completed
    ? {
        opacity: [glowOpacity * 0.6, glowOpacity, glowOpacity * 0.6],
        transition: { duration: pulseDuration, repeat: Infinity, ease: "easeInOut" },
      }
    : {
        opacity: glowOpacity,
        transition: { duration: 1 },
      };

  return (
    <div
      aria-hidden="true"
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85vw] max-w-[650px] aspect-square pointer-events-none z-0 flex items-center justify-center"
      style={{ perspective: 1200 }}
    >
      {/* Layer 1: Static background halo */}
      <div className="absolute inset-0 rounded-full bg-accent/5 blur-[80px]" />

      {/* Layer 7: Completed-state effect */}
      {completed && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 rounded-full bg-accent/15 blur-[100px]"
        />
      )}

      {/* Layer 4: Decorative orbital planes (Outer) */}
      <motion.div
        style={{ rotateX: rotateXOuter, rotateY: rotateYOuter, x: translateXOuter, y: translateYOuter, transformStyle: "preserve-3d" }}
        className="absolute inset-0 flex items-center justify-center transform-gpu"
        animate={completed && !reducedMotion ? { scale: 1.4, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      >
        <motion.svg
          style={{ rotate: continuousRotateZ1 }}
          viewBox="0 0 200 200"
          className="w-[105%] h-[105%] opacity-20 absolute"
        >
          <circle cx="100" cy="100" r="98" fill="none" stroke="var(--accent)" strokeWidth="0.5" strokeDasharray="2 12" />
          <circle cx="100" cy="2" r="1.5" fill="var(--accent)" />
          <circle cx="100" cy="198" r="1" fill="var(--accent)" />
        </motion.svg>

        <motion.svg
          style={{ rotate: continuousRotateZ2 }}
          viewBox="0 0 200 200"
          className="w-full h-full opacity-10 absolute"
        >
          <circle cx="100" cy="100" r="94" fill="none" stroke="var(--accent)" strokeWidth="0.5" />
          <path d="M100 6 A 94 94 0 0 1 194 100" fill="none" stroke="var(--accent)" strokeWidth="1.5" opacity="0.6" />
        </motion.svg>
      </motion.div>

      {/* Layer 4: Decorative orbital planes (Inner) */}
      <motion.div
        style={{ rotateX: rotateXInner, rotateY: rotateYInner, x: translateXInner, y: translateYInner, transformStyle: "preserve-3d" }}
        className="absolute inset-0 flex items-center justify-center transform-gpu"
        animate={completed && !reducedMotion ? { scale: 0.6, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      >
        <motion.svg
          style={{ rotate: continuousRotateZ3 }}
          viewBox="0 0 200 200"
          className="w-[78%] h-[78%] opacity-30 absolute"
        >
          <circle cx="100" cy="100" r="90" fill="none" stroke="var(--line)" strokeWidth="0.5" strokeDasharray="4 4" />
          <circle cx="10" cy="100" r="1" fill="var(--accent)" />
        </motion.svg>
      </motion.div>

      {/* Layers 2, 3, 5: Progress Arc & Track */}
      <motion.div
        style={{ rotateX: rotateXProgress, rotateY: rotateYProgress, x: translateXProgress, y: translateYProgress, transformStyle: "preserve-3d" }}
        className="absolute inset-0 flex items-center justify-center transform-gpu"
        animate={completed && !reducedMotion ? { scale: 1.15, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.0, ease: "easeIn" }}
      >
        <svg viewBox="0 0 200 200" className="w-[85%] h-[85%] -rotate-90">
          {/* Layer 2: Low-opacity dashed track */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--line)"
            strokeWidth="1.5"
            strokeDasharray="2 6"
            className="opacity-30"
          />

          {/* Layer 3: Progress arc */}
          <motion.circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={reducedMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut" }}
            style={{
              filter: "drop-shadow(0 0 6px var(--accent))",
            }}
          />

          {/* Layer 5: Highlight endpoint on the progress arc */}
          {clampedProgress > 0 && (
            <motion.g
              initial={{ rotate: 0 }}
              animate={{ rotate: angle }}
              transition={reducedMotion ? { duration: 0 } : { duration: 1.5, ease: "easeOut" }}
              style={{ transformOrigin: "100px 100px" }}
            >
              <circle
                cx="100"
                cy={100 - radius}
                r="3"
                fill="#fff"
                style={{ filter: "drop-shadow(0 0 4px #fff)" }}
              />
            </motion.g>
          )}
        </svg>

        {/* Layer 6: Soft bloom based on urgency */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={pulseVariant}
          className="absolute inset-0 rounded-full pointer-events-none mix-blend-screen"
          style={{
            background: "radial-gradient(circle, transparent 65%, var(--accent) 70%, transparent 74%)",
            filter: "blur(12px)",
          }}
        />

        {/* Layer 6b: Atmospheric particles (only completed) */}
        {completed && !reducedMotion && (
          <motion.svg
            style={{ rotate: continuousRotateZ1 }}
            viewBox="0 0 200 200"
            className="w-[95%] h-[95%] absolute opacity-60"
          >
            <circle cx="100" cy="15" r="1" fill="#fff" />
            <circle cx="20" cy="80" r="1.5" fill="#fff" opacity="0.7" />
            <circle cx="170" cy="140" r="1" fill="#fff" opacity="0.5" />
          </motion.svg>
        )}
      </motion.div>
    </div>
  );
}
