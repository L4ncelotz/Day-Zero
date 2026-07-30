"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "motion/react";

interface CustomCursorProps {
  reducedMotion?: boolean;
}

export function CustomCursor({ reducedMotion = false }: CustomCursorProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPointerDevice, setIsPointerDevice] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Position motion values
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);

  // Smooth springs for outer ring & ambient spotlight trail
  const springConfigRing = { damping: 26, stiffness: 220, mass: 0.4 };
  const springConfigSpotlight = { damping: 35, stiffness: 90, mass: 1 };

  const smoothX = useSpring(cursorX, springConfigRing);
  const smoothY = useSpring(cursorY, springConfigRing);
  const spotlightX = useSpring(cursorX, springConfigSpotlight);
  const spotlightY = useSpring(cursorY, springConfigSpotlight);

  useEffect(() => {
    if (reducedMotion) return;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) return;
    setIsPointerDevice(true);
    document.body.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    // Track hover on interactive elements
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isInteractive = target.closest("button, a, [role='button'], input, .interactive-hover");
      setIsHovered(!!isInteractive);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mousemove", handleElementHover);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      document.body.classList.remove("custom-cursor-active");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mousemove", handleElementHover);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [reducedMotion, cursorX, cursorY, isVisible]);

  if (!isPointerDevice || reducedMotion || !isVisible) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Dynamic Cursor Light Spotlight */}
      <motion.div
        style={{
          x: spotlightX,
          y: spotlightY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        className="absolute w-72 h-72 rounded-full bg-[radial-gradient(circle,rgba(147,197,253,0.15)_0%,rgba(99,102,241,0.06)_40%,transparent_70%)] blur-2xl"
      />

      {/* Outer Spring Ring & Target Reticle */}
      <motion.div
        style={{
          x: smoothX,
          y: smoothY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 1.6 : 1,
          borderColor: isHovered ? "rgba(147, 197, 253, 0.9)" : "rgba(147, 197, 253, 0.35)",
          backgroundColor: isHovered ? "rgba(99, 102, 241, 0.2)" : "transparent",
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute w-9 h-9 rounded-full border border-blue-300/40 backdrop-blur-[1px] flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.35)]"
      >
        {/* Reticle Crosshair tick marks when hovering buttons */}
        {isHovered && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <div className="absolute top-[-3px] w-[2px] h-2 bg-accent shadow-[0_0_8px_var(--accent)]" />
            <div className="absolute bottom-[-3px] w-[2px] h-2 bg-accent shadow-[0_0_8px_var(--accent)]" />
            <div className="absolute left-[-3px] h-[2px] w-2 bg-accent shadow-[0_0_8px_var(--accent)]" />
            <div className="absolute right-[-3px] h-[2px] w-2 bg-accent shadow-[0_0_8px_var(--accent)]" />
          </motion.div>
        )}
      </motion.div>

      {/* Core Cursor Glowing Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovered ? 0.5 : 1,
        }}
        transition={{ duration: 0.15 }}
        className="absolute w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#ffffff]"
      />
    </div>
  );
}
