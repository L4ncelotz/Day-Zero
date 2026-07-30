"use client";

import React from "react";
import { formatDisplayDate } from "@/lib/countdown/dates";

interface SecondaryStatsProps {
  remainingCalendarDays: number;
  remainingWeeks: number;
  lastUpdatedAt: string;
}

export function SecondaryStats({
  remainingCalendarDays,
  remainingWeeks,
  lastUpdatedAt,
}: SecondaryStatsProps) {
  let formattedUpdateDate = "29 Jul 2026";
  if (lastUpdatedAt) {
    const bangkokDateStr = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Bangkok",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(lastUpdatedAt));
    formattedUpdateDate = formatDisplayDate(bangkokDateStr, { format: "short" });
  }

  return (
    <div
      data-intro="stat"
      className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs text-text-tertiary font-mono tracking-wide"
    >
      <span>{remainingCalendarDays} วันปฏิทิน</span>
      <span className="text-line-strong">·</span>
      <span>ประมาณ {remainingWeeks} สัปดาห์</span>
      <span className="text-line-strong">·</span>
      <span>อัปเดตล่าสุด {formattedUpdateDate}</span>
    </div>
  );
}
