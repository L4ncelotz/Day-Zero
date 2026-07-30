"use client";

import React from "react";
import { motion, AnimatePresence } from "motion/react";

interface CountdownDigitsProps {
  value: number;
  label: string;
  reducedMotion?: boolean;
}

export function CountdownDigits({ value, label, reducedMotion = false }: CountdownDigitsProps) {
  const digits = String(value).split("");

  return (
    <div
      className="relative flex items-center justify-center my-2 sm:my-4"
      aria-label={`เหลือ ${value} ${label}`}
    >
      <div className="flex items-center justify-center overflow-hidden py-2 px-2 sm:px-4" aria-hidden="true">
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
                  initial={{ y: "80%", opacity: 0, filter: "blur(6px)" }}
                  animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
                  exit={{ y: "-80%", opacity: 0, filter: "blur(6px)" }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 32,
                    mass: 0.9,
                  }}
                  className="text-text-primary block drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]"
                >
                  {digit}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
