"use client";

import React from "react";
import { ScheduleOverride } from "@/lib/countdown/types";
import { formatDisplayDate } from "@/lib/countdown/dates";
import { Badge } from "@/components/ui/badge";

interface UpcomingOverrideProps {
  overrides: ScheduleOverride[];
}

export function UpcomingOverride({ overrides }: UpcomingOverrideProps) {
  if (!overrides || overrides.length === 0) return null;

  const nextOverride = overrides[0];
  const dayName = formatDisplayDate(nextOverride.date, { format: "dayName" });
  const formattedDate = formatDisplayDate(nextOverride.date, { format: "short" });

  return (
    <div className="mt-4 flex items-center justify-center gap-2">
      <Badge
        variant={nextOverride.status === "working" ? "working" : "holiday"}
        className="font-mono text-[11px] uppercase tracking-wider px-3 py-1"
      >
        {dayName} {formattedDate} · {nextOverride.label || (nextOverride.status === "working" ? "ทำงานพิเศษ" : "วันหยุดบริษัท")}
      </Badge>
    </div>
  );
}
