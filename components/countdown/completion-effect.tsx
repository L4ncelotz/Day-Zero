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

  const particles = Array.from({ length: 20 });

  return (
    <div className="fixed inset-0 pointer-events-none z-40 flex items-center justify-center overflow-hidden">
      {/* Expanding Halo */}
      <motion.div
        initial={{ scale: 0.2, opacity: 0.8 }}
        animate={{ scale: 2.2, opacity: 0 }}
        transition={{ duration: 1.8, ease: "easeOut" }}
        className="w-[450px] h-[450px] rounded-full border-2 border-accent shadow-[0_0_80px_var(--accent)]"
      />

      {/* Particle Sparks */}
      {particles.map((_, i) => {
        const angle = (i / particles.length) * 360;
        const radius = 180 + Math.random() * 80;
        const x = Math.cos((angle * Math.PI) / 180) * radius;
        const y = Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
            animate={{ x, y, scale: 0, opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="absolute w-2 h-2 rounded-full bg-accent shadow-[0_0_12px_var(--accent)]"
          />
        );
      })}
    </div>
  );
}
