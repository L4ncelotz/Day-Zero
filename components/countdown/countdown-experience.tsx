"use client";

import { Button } from "@/components/ui/button";
import { CalculationResult, CountdownMode } from "@/lib/countdown/types";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotionValue, useSpring } from "motion/react";
import { Check, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast, Toaster } from "sonner";
import { AmbientBackground } from "./ambient-background";
import { CinematicOrbit } from "./cinematic-orbit";
import { CompletionEffect } from "./completion-effect";
import { CountdownDigits } from "./countdown-digits";
import { CountdownModeToggle } from "./countdown-mode-toggle";
import { HeroLanding } from "./hero-landing";
import { ProgressTrack } from "./progress-track";
import { SecondaryStats } from "./secondary-stats";
import { UpcomingOverride } from "./upcoming-override";
import { CustomCursor } from "./custom-cursor";
import { MilestoneTimeline } from "./milestone-timeline";

gsap.registerPlugin(ScrollTrigger);

interface CountdownExperienceProps {
  initialResult: CalculationResult;
}

export function CountdownExperience({
  initialResult,
}: CountdownExperienceProps) {
  const [mode, setMode] = useState<CountdownMode>("working");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [copied, setCopied] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Centralized pointer tracking for Parallax
  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const smoothPointerX = useSpring(pointerX, { damping: 25, stiffness: 120, mass: 0.6 });
  const smoothPointerY = useSpring(pointerY, { damping: 25, stiffness: 120, mass: 0.6 });

  // Midnight auto-refresh in Bangkok timezone
  useEffect(() => {
    const timer = setInterval(() => {
      const bangkokDate = new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Bangkok",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(new Date());

      if (bangkokDate !== initialResult.todayKey) {
        router.refresh();
      }
    }, 60_000);

    return () => clearInterval(timer);
  }, [initialResult.todayKey, router]);

  // Load saved preference + reduced motion listener
  useEffect(() => {
    const savedMode = localStorage.getItem(
      "internship_countdown_mode",
    ) as CountdownMode;
    if (savedMode === "working" || savedMode === "calendar") {
      setMode(savedMode);
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);

    const handleChange = (e: MediaQueryListEvent) =>
      setReducedMotion(e.matches);
    motionQuery.addEventListener("change", handleChange);
    return () => motionQuery.removeEventListener("change", handleChange);
  }, []);

  // Desktop pointer tracking listener
  useEffect(() => {
    if (reducedMotion) return;
    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mediaQuery.matches) return;

    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      pointerX.set(x);
      pointerY.set(y);
    };

    const handleMouseLeave = () => {
      pointerX.set(0);
      pointerY.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [reducedMotion, pointerX, pointerY]);

  // GSAP ScrollTrigger: Hero → Countdown transition
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.config({ nullTargetWarn: false });

      // Pin hero and animate it out on scroll
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "[data-hero]",
          start: "top top",
          end: "bottom top",
          pin: true,
          scrub: 0.8,
        },
      });

      heroTl
        .to("[data-hero-logo]", {
          scale: 1.08,
          opacity: 0,
          y: -40,
          duration: 1,
          ease: "power2.in",
        })
        .to(
          "[data-hero-tagline]",
          {
            opacity: 0,
            y: -20,
            duration: 0.6,
          },
          "<0.1",
        )
        .to(
          "[data-hero-scroll]",
          {
            opacity: 0,
            duration: 0.3,
          },
          "<",
        );

      // Countdown section entrance animation
      gsap.from("[data-countdown-section]", {
        scrollTrigger: {
          trigger: "[data-countdown-section]",
          start: "top 85%",
          end: "top 40%",
          scrub: 0.5,
        },
        opacity: 0,
        y: 60,
        filter: "blur(8px)",
      });

      // Countdown content intro (plays once when section enters)
      ScrollTrigger.create({
        trigger: "[data-countdown-section]",
        start: "top 60%",
        once: true,
        onEnter: () => {
          const played = sessionStorage.getItem("internship_intro_played");
          if (played) {
            gsap.set("[data-intro='bg'], [data-intro='orbit'], [data-intro='eyebrow'], [data-intro='number'], [data-intro='stat']", { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" });
            gsap.set("[data-intro='progress']", { scaleX: 1 });
            return;
          }
          
          sessionStorage.setItem("internship_intro_played", "true");

          const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
          tl.from("[data-intro='bg']", {
            opacity: 0,
            duration: 1.5,
          })
            .from("[data-intro='orbit']", {
              scale: 0.8,
              opacity: 0,
              duration: 1.2,
            }, "-=1.0")
            .from("[data-intro='eyebrow']", {
              y: 12,
              opacity: 0,
              duration: 0.8,
            }, "-=0.8")
            .from(
              "[data-intro='number']",
              { y: 36, opacity: 0, filter: "blur(14px)", duration: 1.2 },
              "-=0.6",
            )
            .from(
              "[data-intro='progress']",
              { scaleX: 0, transformOrigin: "left", duration: 1 },
              "-=0.8",
            )
            .from(
              "[data-intro='stat']",
              { y: 8, opacity: 0, stagger: 0.08, duration: 0.8 },
              "-=0.6",
            );
        },
      });
    }, containerRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  const handleModeChange = (newMode: CountdownMode) => {
    setMode(newMode);
    localStorage.setItem("internship_countdown_mode", newMode);
  };

  // Determine displayed numbers according to toggle mode
  const isWorkingMode = mode === "working";
  const displayValue = isWorkingMode
    ? initialResult.remainingWorkingDays
    : initialResult.remainingCalendarDays;

  const displayProgress = isWorkingMode
    ? initialResult.workingProgress
    : initialResult.calendarProgress;

  const displayLabel = isWorkingMode
    ? "workdays until freedom"
    : "days until freedom";

  // Stage calculation for accent color dynamics
  let stage = "stage-60";
  if (initialResult.isCompleted) stage = "completed";
  else if (initialResult.remainingWorkingDays <= 7) stage = "stage-1";
  else if (initialResult.remainingWorkingDays <= 30) stage = "stage-8";
  else if (initialResult.remainingWorkingDays <= 60) stage = "stage-30";

  // Share feature
  const handleShare = async () => {
    const shareText = `${displayValue} ${displayLabel} until 30 October 2026`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Internship Countdown",
          text: shareText,
          url: window.location.href,
        });
        return;
      } catch {
        // Fallback to clipboard
      }
    }
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    toast.success("คัดลอกข้อความแล้ว");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div ref={containerRef} data-stage={stage}>
      <CustomCursor reducedMotion={reducedMotion} />
      <Toaster position="bottom-center" theme="dark" />

      {/* Section 1: Hero Landing */}
      <HeroLanding reducedMotion={reducedMotion} />

      {/* Section 2: Countdown */}
      <div
        data-countdown-section
        className="relative min-h-screen min-h-[100svh] flex flex-col justify-between p-4 sm:p-8 overflow-hidden"
      >
        <div data-intro="bg" className="absolute inset-0 pointer-events-none">
          <AmbientBackground stage={stage} reducedMotion={reducedMotion} pointerX={smoothPointerX} pointerY={smoothPointerY} />
        </div>
        <CompletionEffect
          isCompleted={initialResult.isCompleted}
          reducedMotion={reducedMotion}
        />

        {/* Top Bar */}
        <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between h-14">
          <div className="eyebrow text-text-tertiary">DAY ZERO</div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            className="rounded-full border-line bg-surface/40 backdrop-blur-md hover:bg-surface-elevated min-h-[44px] px-4"
          >
            {copied ? (
              <Check className="h-3.5 w-3.5 mr-1.5 text-success" />
            ) : (
              <Share2 className="h-3.5 w-3.5 mr-1.5" />
            )}
            <span className="text-xs">{copied ? "คัดลอกแล้ว" : "แชร์"}</span>
          </Button>
        </header>

        {/* Main Countdown */}
        <main className="relative z-10 w-full max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center text-center my-auto py-6">
          <div data-intro="orbit" className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
            <CinematicOrbit
              progress={displayProgress}
              urgency={
                initialResult.remainingWorkingDays <= 7
                  ? 3
                  : initialResult.remainingWorkingDays <= 30
                    ? 2
                    : initialResult.remainingWorkingDays <= 60
                      ? 1
                      : 0
              }
              completed={initialResult.isCompleted}
              reducedMotion={reducedMotion}
              pointerX={smoothPointerX}
              pointerY={smoothPointerY}
            />
          </div>

          {/* Eyebrow Status */}
          {initialResult.isBeforeStart ||
          initialResult.isFinalDay ||
          initialResult.isCompleted ? (
            <div data-intro="eyebrow" className="eyebrow text-accent mb-2">
              {initialResult.isBeforeStart
                ? "COUNTDOWN STARTS SOON"
                : initialResult.isFinalDay
                  ? "THE FINAL DAY · TODAY"
                  : "INTERNSHIP COMPLETED"}
            </div>
          ) : null}

          {/* Main Countdown Display */}
          <div
            data-intro="number"
            className="relative z-10 w-full flex flex-col items-center"
          >
            {initialResult.isCompleted ? (
              <div className="countdown-number text-text-primary tracking-tight py-4">
                DAY ZERO
              </div>
            ) : (
              <CountdownDigits
                value={displayValue}
                label={displayLabel}
                reducedMotion={reducedMotion}
                pointerX={smoothPointerX}
                pointerY={smoothPointerY}
              />
            )}

            <div className="text-base sm:text-lg font-medium text-text-secondary mt-1 mb-4">
              {initialResult.isCompleted
                ? "วันสุดท้ายของการฝึกงาน"
                : displayLabel}
            </div>

            <CountdownModeToggle
              mode={mode}
              onModeChange={handleModeChange}
              disabled={initialResult.isCompleted}
            />
          </div>

          {/* Progress Line */}
          <div data-intro="progress" className="w-full flex justify-center">
            <ProgressTrack
              progress={displayProgress}
              reducedMotion={reducedMotion}
            />
          </div>

          {/* End Date */}
          <div className="text-xs sm:text-sm font-mono tracking-widest text-text-secondary uppercase mb-3">
            30 OCTOBER 2026
          </div>

          {/* Supporting Stats */}
          <SecondaryStats
            remainingCalendarDays={initialResult.remainingCalendarDays}
            remainingWeeks={initialResult.remainingWeeks}
            lastUpdatedAt={initialResult.lastUpdatedAt}
          />

          <UpcomingOverride overrides={initialResult.upcomingOverrides} />
        </main>

        <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-2 text-[11px] text-text-tertiary font-mono mt-8">
          ASIA / BANGKOK TIMEZONE
        </footer>
      </div>

      {/* Section 3: Timeline */}
      <MilestoneTimeline />
    </div>
  );
}
