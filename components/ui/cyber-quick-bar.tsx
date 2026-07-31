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

  return (
    <>
      {/* Floating Action Bar (Top Left) */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="fixed top-4 sm:top-6 left-4 sm:left-6 z-40 flex items-center gap-2 p-1.5 rounded-full bg-surface-elevated/70 backdrop-blur-md border border-white/10 shadow-[0_0_20px_rgba(0,0,0,0.5)]"
      >
        <button
          onClick={() => setActiveModal("card")}
          className="p-2 sm:px-3 sm:py-2 rounded-full flex items-center gap-2 hover:bg-white/10 text-text-secondary hover:text-accent transition-colors"
          title="Survivor Card"
        >
          <Camera className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase hidden sm:inline">Survivor Card</span>
        </button>

        <div className="w-[1px] h-4 bg-white/20" />

        <button
          onClick={() => setActiveModal("game")}
          className="p-2 sm:px-3 sm:py-2 rounded-full flex items-center gap-2 hover:bg-white/10 text-text-secondary hover:text-danger transition-colors"
          title="Bug Basher"
        >
          <Bug className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase hidden sm:inline">Bug Basher</span>
        </button>

        <div className="w-[1px] h-4 bg-white/20" />

        <button
          onClick={() => setActiveModal("quote")}
          className="p-2 sm:px-3 sm:py-2 rounded-full flex items-center gap-2 hover:bg-white/10 text-text-secondary hover:text-warning transition-colors"
          title="Daily Meme"
        >
          <Quote className="w-4 h-4" />
          <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase hidden sm:inline">Daily Meme</span>
        </button>

        {onToggleMotion && (
          <>
            <div className="w-[1px] h-4 bg-white/20" />
            <button
              onClick={onToggleMotion}
              className={`p-2 sm:px-3 sm:py-2 rounded-full flex items-center gap-2 hover:bg-white/10 transition-colors ${reducedMotion ? 'text-success' : 'text-text-secondary hover:text-success'}`}
              title={reducedMotion ? "Performance Mode: ON" : "Performance Mode: OFF"}
            >
              {reducedMotion ? <Battery className="w-4 h-4" /> : <BatteryCharging className="w-4 h-4" />}
              <span className="text-[10px] sm:text-xs font-mono font-semibold uppercase hidden sm:inline">
                {reducedMotion ? "Eco Mode" : "High Perf"}
              </span>
            </button>
          </>
        )}
      </motion.div>

      {/* Modals */}
      <InternSurvivorCardModal isOpen={activeModal === "card"} onClose={closeAll} />
      <BugBasherGameModal isOpen={activeModal === "game"} onClose={closeAll} />
      <DailyQuoteModal isOpen={activeModal === "quote"} onClose={closeAll} />
    </>
  );
}
