"use client";

import React, { useEffect, useState } from "react";
import { motion } from "motion/react";

interface CompletionEffectProps {
  isCompleted: boolean;
  reducedMotion?: boolean;
}

export function CompletionEffect({ isCompleted, reducedMotion = false }: CompletionEffectProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (!isCompleted || reducedMotion) return;

    const played = sessionStorage.getItem("internship_completion_played");
    if (!played) {
      setShouldRender(true);
      sessionStorage.setItem("internship_completion_played", "true");

      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [isCompleted, reducedMotion]);

  if (!shouldRender) return null;

  const particles = Array.from({ length: 40 });

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
      {/* Expanding Halo */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.8 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="w-[450px] h-[450px] rounded-full border-2 border-accent shadow-[0_0_80px_var(--accent)]"
      />

      {/* Short Bloom Flash */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 3] }}
        transition={{ duration: 1.2, ease: "easeOut", times: [0, 0.15, 1] }}
        className="absolute w-[200px] h-[200px] rounded-full bg-white mix-blend-screen blur-[40px]"
      />

      {/* Particle Sparks */}
      {particles.map((_, i) => {
        const isViolet = i % 2 === 0;
        const colorClass = isViolet ? "bg-violet-400 shadow-[0_0_12px_rgba(167,139,250,0.8)]" : "bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)]";
        const angle = (i / particles.length) * 360 + (Math.random() * 10 - 5);
        const radius = 150 + Math.random() * 250;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: Math.random() * 0.5 + 0.5, opacity: 1 }}
            animate={{ x, y, scale: 0, opacity: 0 }}
            transition={{ duration: 1.2 + Math.random() * 0.8, ease: "easeOut" }}
            className={`absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${colorClass}`}
          />
        );
      })}
    </div>
  );
}
