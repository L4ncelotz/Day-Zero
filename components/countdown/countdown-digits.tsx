"use client";

import React from "react";
import { motion, AnimatePresence, MotionValue, useTransform, useMotionValue } from "motion/react";

interface CountdownDigitsProps {
  value: number;
  label: string;
  reducedMotion?: boolean;
  pointerX?: MotionValue<number>;
  pointerY?: MotionValue<number>;
}

export function CountdownDigits({ value, label, reducedMotion = false, pointerX, pointerY }: CountdownDigitsProps) {
  const digits = String(value).split("");

  // Parallax constraints: 1-3px
  const dummyX = useMotionValue(0);
  const dummyY = useMotionValue(0);
  const translateX = useTransform(pointerX || dummyX, [-1, 1], [-2, 2]);
  const translateY = useTransform(pointerY || dummyY, [-1, 1], [-2, 2]);

  return (
    <div
      className="relative flex items-center justify-center my-2 sm:my-4"
      aria-label={`เหลือ ${value} ${label}`}
    >
      <motion.div
        style={{ x: reducedMotion ? 0 : translateX, y: reducedMotion ? 0 : translateY }}
        className="flex items-center justify-center overflow-hidden py-2 px-2 sm:px-4"
        aria-hidden="true"
      >
        {digits.map((digit, index) => (
          <div key={`${digits.length}-${index}`} className="countdown-number relative inline-block h-[0.8em]">
            {reducedMotion ? (
              <span className="text-text-primary block drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
                {digit}
              </span>
            ) : (
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.span
                  key={digit}
                  initial={{ y: "100%", opacity: 0, filter: "blur(4px)", scale: 0.96 }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)", scale: 1 }}
                  exit={{ y: "-100%", opacity: 0, filter: "blur(4px)", scale: 0.96 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 28,
                    mass: 0.8,
                  }}
                  className="text-text-primary block drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        ))}
      </motion.div>
    </div>
  );
}
