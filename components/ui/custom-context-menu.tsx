"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "sonner";

interface MenuItem {
  icon: string;
  label: string;
  sublabel?: string;
  action: () => void;
  separator?: false;
}

interface Separator {
  separator: true;
}

type MenuEntry = MenuItem | Separator;

function getDaysLeft(): number {
  const target = new Date("2026-10-30T00:00:00+07:00");
  return Math.max(0, Math.ceil((target.getTime() - Date.now()) / 86_400_000));
}

const buildMenuItems = (): MenuEntry[] => [
  {
    icon: "🔍",
    label: "Scan for Escape Routes",
    sublabel: "sys.execute",
    action: () => toast("No exits detected.", { description: "All perimeters secured. Return to desk." }),
  },
  {
    icon: "📡",
    label: "Ping Headquarters",
    sublabel: "net.request",
    action: () =>
      setTimeout(() => toast("...no response.", { description: "Signal lost somewhere in the meeting room." }), 600),
  },
  {
    icon: "☕",
    label: "Brew Emergency Coffee",
    sublabel: "life.support",
    action: () => toast("Brewing...", { description: "ETA: never. Kettle is broken again." }),
  },
  { separator: true },
  {
    icon: "💾",
    label: "Save Mental State",
    sublabel: "mem.backup",
    action: () => toast("Save failed.", { description: "Memory full. Try deleting some meetings." }),
  },
  {
    icon: "🚨",
    label: "Initiate Day Zero Protocol",
    sublabel: "protocol.d0",
    action: () =>
      toast(`T-${getDaysLeft()} days remaining.`, {
        description: "Stay hydrated. Stay alive. The countdown continues.",
      }),
  },
  { separator: true },
  {
    icon: "🔒",
    label: "Classify This Memory",
    sublabel: "mem.encrypt",
    action: () => toast("Memory classified.", { description: "Eyes only. Do not speak of this to HR." }),
  },
];

export function CustomContextMenu() {
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);

  const close = useCallback(() => setPos(null), []);

  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();

      // Clamp position so menu stays within viewport
      const menuW = 240;
      const menuH = 280;
      const x = Math.min(e.clientX, window.innerWidth - menuW - 8);
      const y = Math.min(e.clientY, window.innerHeight - menuH - 8);
      setPos({ x, y });
    };

    const handleClick = () => close();
    const handleScroll = () => close();
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && close();

    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("click", handleClick);
    document.addEventListener("scroll", handleScroll, { passive: true });
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("click", handleClick);
      document.removeEventListener("scroll", handleScroll);
      document.removeEventListener("keydown", handleKey);
    };
  }, [close]);

  const menuItems = buildMenuItems();

  return (
    <AnimatePresence>
      {pos && (
        <motion.div
          key="ctx-menu"
          initial={{ opacity: 0, scale: 0.92, y: -6 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: -6 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          style={{ left: pos.x, top: pos.y }}
          className="fixed z-[200] w-60 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-2xl shadow-[0_8px_40px_rgba(0,0,0,0.8)] overflow-hidden select-none"
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Header */}
          <div className="px-4 py-2.5 border-b border-white/8">
            <p className="text-[9px] font-mono tracking-[0.3em] text-text-tertiary uppercase">
              DAY ZERO · SECURE TERMINAL
            </p>
          </div>

          {/* Items */}
          <div className="py-1.5">
            {menuItems.map((entry, i) => {
              if ("separator" in entry && entry.separator) {
                return <div key={i} className="my-1 mx-3 h-px bg-white/8" />;
              }
              const item = entry as MenuItem;
              return (
                <button
                  key={i}
                  onClick={() => {
                    item.action();
                    close();
                  }}
                  className="w-full flex items-center gap-3 px-4 py-2 text-left hover:bg-white/8 active:bg-white/12 transition-colors group"
                >
                  <span className="text-base leading-none">{item.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary font-medium leading-none mb-0.5 truncate">
                      {item.label}
                    </p>
                    {item.sublabel && (
                      <p className="text-[9px] font-mono text-text-tertiary tracking-widest">
                        {item.sublabel}
                      </p>
                    )}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-white/8">
            <p className="text-[9px] font-mono tracking-[0.2em] text-text-tertiary/50 text-center">
              [ CLASSIFIED · EYES ONLY ]
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
