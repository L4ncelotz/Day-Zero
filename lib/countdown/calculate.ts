import { COUNTDOWN_CONFIG } from "../config";
import { parseDateOnly, formatDateKey, generateDateRange, getBangkokDateKey } from "./dates";
import { ScheduleOverride, ScheduleData, CalculationResult } from "./types";

/**
 * Checks if a specific dateKey (YYYY-MM-DD) is a working day based on overrides and standard Mon-Fri rule.
 */
export function isWorkingDay(dateKey: string, overrides: ScheduleOverride[] = []): boolean {
  const override = overrides.find((item) => item.date === dateKey);

  if (override) {
    return override.status === "working";
  }

  const date = parseDateOnly(dateKey);
  const day = date.getDay();
  return day >= 1 && day <= 5; // Monday to Friday
}

/**
 * Main calculation engine for the Internship Countdown.
 */
export function calculateCountdown(
  scheduleData: ScheduleData,
  customTodayKey?: string,
  usingFallback: boolean = false
): CalculationResult {
  const startDateKey = COUNTDOWN_CONFIG.startDate;
  const endDateKey = COUNTDOWN_CONFIG.endDate;
  const todayKey = customTodayKey || getBangkokDateKey();
  const overrides = scheduleData.overrides || [];

  // Generate full period date keys (inclusive)
  const fullRange = generateDateRange(startDateKey, endDateKey);
  const totalCalendarDays = fullRange.length; // Baseline: 94 days

  // Calculate total working days in full period
  const totalWorkingDays = fullRange.filter((dKey) => isWorkingDay(dKey, overrides)).length; // Baseline: 68 days

  const isBeforeStart = todayKey < startDateKey;
  const isFinalDay = todayKey === endDateKey;
  const isCompleted = todayKey > endDateKey;

  let remainingWorkingDays = 0;
  let remainingCalendarDays = 0;

  if (isBeforeStart) {
    remainingCalendarDays = totalCalendarDays;
    remainingWorkingDays = totalWorkingDays;
  } else if (isCompleted) {
    remainingCalendarDays = 0;
    remainingWorkingDays = 0;
  } else {
    // Active window: todayKey is between startDateKey and endDateKey (inclusive)
    const remainingRange = generateDateRange(todayKey, endDateKey);
    remainingCalendarDays = remainingRange.length;
    remainingWorkingDays = remainingRange.filter((dKey) => isWorkingDay(dKey, overrides)).length;
  }

  const completedCalendarDays = totalCalendarDays - remainingCalendarDays;
  const completedWorkingDays = totalWorkingDays - remainingWorkingDays;

  const calendarProgress =
    totalCalendarDays > 0
      ? Math.min(100, Math.max(0, (completedCalendarDays / totalCalendarDays) * 100))
      : 100;

  const workingProgress =
    totalWorkingDays > 0
      ? Math.min(100, Math.max(0, (completedWorkingDays / totalWorkingDays) * 100))
      : 100;

  const remainingWeeks = Math.ceil(remainingCalendarDays / 7);

  // Filter upcoming overrides (within next 14 days from todayKey)
  const fourteenDaysLater = formatDateKey(
    new Date(parseDateOnly(todayKey).getTime() + 14 * 24 * 60 * 60 * 1000)
  );

  const upcomingOverrides = overrides
    .filter((ovr) => ovr.date >= todayKey && ovr.date <= fourteenDaysLater)
    .sort((a, b) => a.date.localeCompare(b.date));

  return {
    todayKey,
    isBeforeStart,
    isFinalDay,
    isCompleted,
    totalWorkingDays,
    remainingWorkingDays,
    completedWorkingDays,
    workingProgress,
    totalCalendarDays,
    remainingCalendarDays,
    completedCalendarDays,
    calendarProgress,
    remainingWeeks,
    upcomingOverrides,
    lastUpdatedAt: scheduleData.lastUpdatedAt,
    usingFallback,
  };
}
