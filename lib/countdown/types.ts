export type ScheduleStatus = "working" | "holiday";

export type ScheduleOverride = {
  id: string;
  date: string; // YYYY-MM-DD
  status: ScheduleStatus;
  label: string;
};

export type Milestone = {
  id: string;
  date: string; // Free text date string e.g. "1 November 2025" or "Q3 2026"
  title: string;
  description: string;
  isCompleted: boolean;
};

export type ScheduleData = {
  version: 1;
  lastUpdatedAt: string; // ISO 8601 string
  overrides: ScheduleOverride[];
  milestones?: Milestone[];
};

export type CountdownMode = "working" | "calendar";

export type CalculationResult = {
  todayKey: string;
  isBeforeStart: boolean;
  isFinalDay: boolean;
  isCompleted: boolean;
  totalWorkingDays: number;
  remainingWorkingDays: number;
  completedWorkingDays: number;
  workingProgress: number; // 0 to 100
  totalCalendarDays: number;
  remainingCalendarDays: number;
  completedCalendarDays: number;
  calendarProgress: number; // 0 to 100
  remainingWeeks: number;
  upcomingOverrides: ScheduleOverride[];
  lastUpdatedAt: string;
  usingFallback: boolean;
};
