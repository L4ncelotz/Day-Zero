"use client";

import React from "react";
import { CountdownMode } from "@/lib/countdown/types";
import { cn } from "@/lib/utils";

interface CountdownModeToggleProps {
  mode: CountdownMode;
  onModeChange: (mode: CountdownMode) => void;
  disabled?: boolean;
}

export function CountdownModeToggle({ mode, onModeChange, disabled = false }: CountdownModeToggleProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-line bg-surface/80 p-1 backdrop-blur-md">
      <button
        type="button"
        disabled={disabled}
        onClick={() => onModeChange("working")}
        className={cn(
          "px-4 py-2.5 text-xs font-medium rounded-lg transition-all duration-200",
          mode === "working"
            ? "bg-surface-elevated text-text-primary shadow-sm border border-line-strong"
            : "text-text-tertiary hover:text-text-secondary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        Workdays
      </button>
      <button
        type="button"
        disabled={disabled}
        onClick={() => onModeChange("calendar")}
        className={cn(
          "px-4 py-2.5 text-xs font-medium rounded-lg transition-all duration-200",
          mode === "calendar"
            ? "bg-surface-elevated text-text-primary shadow-sm border border-line-strong"
            : "text-text-tertiary hover:text-text-secondary",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        All Days
      </button>
    </div>
  );
}
