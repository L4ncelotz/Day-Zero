"use client";

import React, { useEffect, useState } from "react";
import gsap from "gsap";
import { Share2, Info, Check } from "lucide-react";
import { toast, Toaster } from "sonner";
import { useRouter } from "next/navigation";
import { CalculationResult, CountdownMode } from "@/lib/countdown/types";
import { AmbientBackground } from "./ambient-background";
import { RiveOrbit } from "./rive-orbit";
import { CountdownDigits } from "./countdown-digits";
import { CountdownModeToggle } from "./countdown-mode-toggle";
import { ProgressTrack } from "./progress-track";
import { SecondaryStats } from "./secondary-stats";
import { UpcomingOverride } from "./upcoming-override";
import { CompletionEffect } from "./completion-effect";
import { Button } from "@/components/ui/button";

interface CountdownExperienceProps {
  initialResult: CalculationResult;
}

export function CountdownExperience({ initialResult }: CountdownExperienceProps) {
  const [mode, setMode] = useState<CountdownMode>("working");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [copied, setCopied] = useState(false);
  const router = useRouter();

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

  // Load saved preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem("internship_countdown_mode") as CountdownMode;
    if (savedMode === "working" || savedMode === "calendar") {
      setMode(savedMode);
    }

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(motionQuery.matches);
  }, []);

  const handleModeChange = (newMode: CountdownMode) => {
    setMode(newMode);
    localStorage.setItem("internship_countdown_mode", newMode);
  };

  // GSAP Intro Timeline (Run once on mount)
  useEffect(() => {
    if (reducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.config({ nullTargetWarn: false });
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from("[data-intro='eyebrow']", { y: 12, opacity: 0, duration: 0.45 })
        .from("[data-intro='number']", { y: 36, opacity: 0, filter: "blur(14px)", duration: 0.75 }, "-=0.2")
        .from("[data-intro='progress']", { scaleX: 0, transformOrigin: "left", duration: 0.65 }, "-=0.35")
        .from("[data-intro='stat']", { y: 8, opacity: 0, stagger: 0.06, duration: 0.35 }, "-=0.25");
    });

    return () => ctx.revert();
  }, [reducedMotion]);

  // Determine displayed numbers according to toggle mode
  const isWorkingMode = mode === "working";
  const displayValue = isWorkingMode
    ? initialResult.remainingWorkingDays
    : initialResult.remainingCalendarDays;

  const displayProgress = isWorkingMode
    ? initialResult.workingProgress
    : initialResult.calendarProgress;

  const displayLabel = isWorkingMode ? "workdays until freedom" : "days until freedom";

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
    <div className="relative min-h-screen min-h-[100svh] flex flex-col justify-between p-4 sm:p-8 overflow-hidden" data-stage={stage}>
      <Toaster position="bottom-center" theme="dark" />
      <AmbientBackground stage={stage} reducedMotion={reducedMotion} />
      <CompletionEffect isCompleted={initialResult.isCompleted} reducedMotion={reducedMotion} />

      {/* Top Bar */}
      <header className="relative z-10 w-full max-w-6xl mx-auto flex items-center justify-between h-14">
        <div className="eyebrow text-text-tertiary">
          DAY ZERO
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="rounded-full border-line bg-surface/40 backdrop-blur-md hover:bg-surface-elevated min-h-[44px] px-4"
        >
          {copied ? <Check className="h-3.5 w-3.5 mr-1.5 text-success" /> : <Share2 className="h-3.5 w-3.5 mr-1.5" />}
          <span className="text-xs">{copied ? "คัดลอกแล้ว" : "แชร์"}</span>
        </Button>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 w-full max-w-3xl mx-auto flex-1 flex flex-col items-center justify-center text-center my-auto py-6">
        <RiveOrbit
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
        />

        {/* Eyebrow Status */}
        {initialResult.isBeforeStart || initialResult.isFinalDay || initialResult.isCompleted ? (
          <div data-intro="eyebrow" className="eyebrow text-accent mb-2">
            {initialResult.isBeforeStart
              ? "COUNTDOWN STARTS SOON"
              : initialResult.isFinalDay
              ? "THE FINAL DAY · TODAY"
              : "INTERNSHIP COMPLETED"}
          </div>
        ) : null}

        {/* Main Countdown Display */}
        <div data-intro="number" className="relative z-10 w-full flex flex-col items-center">
          {initialResult.isCompleted ? (
            <div className="countdown-number text-text-primary tracking-tight py-4">
              COMPLETED
            </div>
          ) : (
            <CountdownDigits
              value={displayValue}
              label={displayLabel}
              reducedMotion={reducedMotion}
            />
          )}

          <div className="text-base sm:text-lg font-medium text-text-secondary mt-1 mb-4">
            {initialResult.isCompleted ? "วันสุดท้ายของการฝึกงาน" : displayLabel}
          </div>

          <CountdownModeToggle
            mode={mode}
            onModeChange={handleModeChange}
            disabled={initialResult.isCompleted}
          />
        </div>

        {/* Progress Line */}
        <div data-intro="progress" className="w-full flex justify-center">
          <ProgressTrack progress={displayProgress} reducedMotion={reducedMotion} />
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

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto text-center py-2 text-[11px] text-text-tertiary font-mono">
        ASIA / BANGKOK TIMEZONE
      </footer>
    </div>
  );
}
