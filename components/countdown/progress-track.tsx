"use client";

import React from "react";
import { motion } from "motion/react";

interface ProgressTrackProps {
  progress: number; // 0 to 100
  reducedMotion?: boolean;
}

export function ProgressTrack({ progress, reducedMotion = false }: ProgressTrackProps) {
  const roundedProgress = Math.round(progress);

  return (
    <div className="w-full max-w-md my-6 space-y-2.5" aria-label={`ดำเนินไปแล้ว ${roundedProgress} เปอร์เซ็นต์`}>
      <div className="flex items-center justify-between text-[11px] font-mono tracking-widest text-text-tertiary uppercase">
        <span>0%</span>
        <span className="text-text-secondary font-semibold">{roundedProgress}% COMPLETE</span>
        <span>100%</span>
      </div>

      <div className="relative h-1.5 w-full rounded-full bg-line overflow-hidden">
        {reducedMotion ? (
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, var(--accent) 0%, var(--accent-secondary) 100%)`,
            }}
          />
        ) : (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="h-full rounded-full relative"
            style={{
              background: `linear-gradient(90deg, var(--accent) 0%, var(--accent-secondary) 100%)`,
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-text-primary shadow-[0_0_8px_var(--accent)]" />
          </motion.div>
        )}
      </div>
    </div>
  );
}
