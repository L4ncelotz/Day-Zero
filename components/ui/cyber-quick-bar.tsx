"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Camera, Bug, Quote, X, BatteryCharging, Battery } from "lucide-react";
import { InternSurvivorCardModal } from "../features/intern-survivor-card-modal";
import { BugBasherGameModal } from "../features/bug-basher-game-modal";
import { DailyQuoteModal } from "../features/daily-quote-modal";

interface CyberQuickBarProps {
  reducedMotion?: boolean;
  onToggleMotion?: () => void;
}

export function CyberQuickBar({ reducedMotion = false, onToggleMotion }: CyberQuickBarProps) {
  const [activeModal, setActiveModal] = useState<"card" | "game" | "quote" | null>(null);

  const closeAll = () => setActiveModal(null);

  const buttons = [
    {
      key: "card" as const,
      icon: <Camera className="w-4 h-4" />,
      label: "Survivor Card",
      hoverColor: "hover:text-accent",
    },
    {
      key: "game" as const,
      icon: <Bug className="w-4 h-4" />,
      label: "Bug Basher",
      hoverColor: "hover:text-danger",
    },
    {
      key: "quote" as const,
      icon: <Quote className="w-4 h-4" />,
      label: "Daily Meme",
      hoverColor: "hover:text-warning",
    },
  ];

  return (
    <>
      {/* ─── Desktop: top-left floating bar ─── */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="hidden sm:flex fixed top-6 left-6 z-50 items-center gap-2 p-1.5 rounded-full bg-surface-elevated/70 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        {buttons.map((btn, i) => (
          <React.Fragment key={btn.key}>
            {i > 0 && <div className="w-[1px] h-4 bg-white/20" />}
            <button
              onClick={() => setActiveModal(btn.key)}
              className={`px-3 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 text-text-secondary ${btn.hoverColor} transition-colors`}
              title={btn.label}
            >
              {btn.icon}
              <span className="text-xs font-mono font-semibold uppercase">{btn.label}</span>
            </button>
          </React.Fragment>
        ))}

        {onToggleMotion && (
          <>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
              onClick={onToggleMotion}
              className={`px-3 py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors ${reducedMotion ? "text-success" : "text-text-secondary hover:text-success"}`}
              title={reducedMotion ? "Performance Mode: ON" : "Performance Mode: OFF"}
            >
              {reducedMotion ? <Battery className="w-4 h-4" /> : <BatteryCharging className="w-4 h-4" />}
              <span className="text-xs font-mono font-semibold uppercase">
                {reducedMotion ? "Eco Mode" : "High Perf"}
              </span>
            </button>
          </>
        )}
      </motion.div>

      {/* ─── Mobile: bottom-center icon pill ─── */}
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.8 }}
        className="sm:hidden fixed bottom-0 left-0 right-0 z-40 flex justify-center pb-safe"
        style={{ paddingBottom: "max(env(safe-area-inset-bottom, 0px), 16px)" }}
      >
        <div className="flex items-center gap-1 px-3 py-2 rounded-full bg-surface-elevated/85 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.6)]">
          {buttons.map((btn) => (
            <button
              key={btn.key}
              onClick={() => setActiveModal(btn.key)}
              className={`w-12 h-12 rounded-full flex items-center justify-center text-text-secondary ${btn.hoverColor} hover:bg-white/10 active:scale-90 transition-all`}
              title={btn.label}
            >
              {btn.icon}
            </button>
          ))}

          {onToggleMotion && (
            <>
              <div className="w-[1px] h-5 bg-white/20 mx-1" />
              <button
                onClick={onToggleMotion}
                className={`w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/10 active:scale-90 transition-all ${reducedMotion ? "text-success" : "text-text-secondary hover:text-success"}`}
                title={reducedMotion ? "Eco Mode ON" : "High Perf"}
              >
                {reducedMotion ? <Battery className="w-4 h-4" /> : <BatteryCharging className="w-4 h-4" />}
              </button>
            </>
          )}
        </div>
      </motion.div>

      {/* Modals */}
      <InternSurvivorCardModal isOpen={activeModal === "card"} onClose={closeAll} />
      <BugBasherGameModal isOpen={activeModal === "game"} onClose={closeAll} />
      <DailyQuoteModal isOpen={activeModal === "quote"} onClose={closeAll} />
    </>
  );
}
