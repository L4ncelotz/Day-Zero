"use client";

import React from "react";
import { ScheduleOverride } from "@/lib/countdown/types";

interface ScheduleSummaryProps {
  totalWorkingDays: number;
  overrides: ScheduleOverride[];
}

export function ScheduleSummary({ totalWorkingDays, overrides }: ScheduleSummaryProps) {
  const holidayCount = overrides.filter((o) => o.status === "holiday").length;
  const workingCount = overrides.filter((o) => o.status === "working").length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-6">
      <div className="p-4 rounded-xl border border-line bg-surface p-4 space-y-1">
        <div className="text-xs text-text-tertiary">วันทำงานทั้งหมด</div>
        <div className="text-2xl font-bold font-mono text-text-primary">{totalWorkingDays} วัน</div>
      </div>

      <div className="p-4 rounded-xl border border-line bg-surface p-4 space-y-1">
        <div className="text-xs text-text-tertiary">วันหยุดพิเศษที่เพิ่ม</div>
        <div className="text-2xl font-bold font-mono text-warning">{holidayCount} วัน</div>
      </div>

      <div className="p-4 rounded-xl border border-line bg-surface p-4 space-y-1">
        <div className="text-xs text-text-tertiary">วันเสาร์ทำงานพิเศษ</div>
        <div className="text-2xl font-bold font-mono text-accent">{workingCount} วัน</div>
      </div>
    </div>
  );
}
