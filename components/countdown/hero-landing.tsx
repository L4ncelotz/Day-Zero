"use client";

import { useState, useEffect } from "react";
import { D0HeroScene } from "./d0-hero-scene";

interface HeroLandingProps {
  reducedMotion: boolean;
}

/**
 * Full-viewport cinematic hero section.
 * Contains: starfield background, 2.5D interactive D0 Eclipse Scene, tagline, and scroll indicator.
 * Pinned and animated out via GSAP ScrollTrigger from the parent.
 */
export function HeroLanding({ reducedMotion }: HeroLandingProps) {
  const [stars, setStars] = useState<any[]>([]);

  useEffect(() => {
    const starCount = 80;
    setStars(
      Array.from({ length: starCount }).map((_, i) => ({
        id: i,
        size: Math.random() * 2 + 0.5,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5,
        duration: 2 + Math.random() * 3,
        opacity: 0.2 + Math.random() * 0.6,
      }))
    );
  }, []);

  return (
    <section
      data-hero
      className="relative w-full h-screen h-[100svh] flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Starfield */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {stars.map((star) => (
          <div
            key={star.id}
            style={{
              position: "absolute",
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              borderRadius: "50%",
              background: "#fff",
              opacity: star.opacity,
              animation: reducedMotion
                ? "none"
                : `twinkle ${star.duration}s ${star.delay}s ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* 2.5D Interactive D0 Eclipse Logo Scene */}
      <div
        data-hero-logo
        className="relative z-10 w-full flex items-center justify-center -mt-6 sm:-mt-8"
      >
        <D0HeroScene reducedMotion={reducedMotion} />
      </div>

      {/* Tagline */}
      <div
        data-hero-tagline
        className="relative z-10 -mt-2 sm:-mt-4 text-center space-y-2"
      >
        <h1 className="text-xs sm:text-sm tracking-[0.35em] font-semibold text-text-secondary uppercase">
          Day Zero — Until Freedom
        </h1>
        <p className="text-[11px] sm:text-xs tracking-[0.2em] text-text-tertiary font-mono">
          INTERNSHIP COUNTDOWN · 30 OCT 2026
        </p>
      </div>

      {/* Scroll Indicator — hidden on mobile, bottom nav bar serves the same purpose */}
      <div
        data-hero-scroll
        className="hidden sm:flex absolute bottom-12 left-1/2 -translate-x-1/2 flex-col items-center gap-2 text-text-tertiary z-10"
      >
        <span className="text-[10px] tracking-[0.3em] uppercase font-mono">
          Scroll
        </span>
        <svg
          width="16"
          height="24"
          viewBox="0 0 16 24"
          fill="none"
          className={reducedMotion ? "" : "animate-bounce"}
          aria-hidden="true"
        >
          <path
            d="M8 4 L8 18 M3 14 L8 19 L13 14"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
    </section>
  );
}
