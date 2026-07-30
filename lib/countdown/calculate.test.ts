import { describe, it, expect } from "vitest";
import { calculateCountdown, isWorkingDay } from "./calculate";
import { validateOverrideInput } from "./validation";
import { ScheduleData } from "./types";

const emptySchedule: ScheduleData = {
  version: 1,
  lastUpdatedAt: "2026-07-29T00:00:00+07:00",
  overrides: [],
};

describe("Internship Countdown Core Logic", () => {
  it("Rule 1 & 2: Baseline 2026-07-29 to 2026-10-30 equals 68 working days and 94 calendar days on start date", () => {
    const res = calculateCountdown(emptySchedule, "2026-07-29");
    expect(res.totalWorkingDays).toBe(68);
    expect(res.totalCalendarDays).toBe(94);
    expect(res.remainingWorkingDays).toBe(68);
    expect(res.remainingCalendarDays).toBe(94);
    expect(res.completedWorkingDays).toBe(0);
    expect(res.completedCalendarDays).toBe(0);
    expect(res.workingProgress).toBe(0);
    expect(res.calendarProgress).toBe(0);
  });

  it("Rule 3: Saturday by default is not counted as a working day", () => {
    expect(isWorkingDay("2026-08-01", [])).toBe(false); // 2026-08-01 is Saturday
  });

  it("Rule 4: Saturday override working MUST be counted as a working day", () => {
    const overrides = [{ id: "1", date: "2026-08-01", status: "working" as const, label: "Special Saturday Work" }];
    expect(isWorkingDay("2026-08-01", overrides)).toBe(true);

    const scheduleWithSatWork: ScheduleData = { ...emptySchedule, overrides };
    const res = calculateCountdown(scheduleWithSatWork, "2026-07-29");
    expect(res.totalWorkingDays).toBe(69);
    expect(res.remainingWorkingDays).toBe(69);
  });

  it("Rule 5: Monday override holiday MUST NOT be counted as a working day", () => {
    const overrides = [{ id: "1", date: "2026-08-03", status: "holiday" as const, label: "Company Holiday" }];
    expect(isWorkingDay("2026-08-03", overrides)).toBe(false); // 2026-08-03 is Monday

    const scheduleWithMonHoliday: ScheduleData = { ...emptySchedule, overrides };
    const res = calculateCountdown(scheduleWithMonHoliday, "2026-07-29");
    expect(res.totalWorkingDays).toBe(67);
  });

  it("Rule 6 & 7: Inclusive counting includes today and end date", () => {
    // On the final day 2026-10-30 (Friday)
    const res = calculateCountdown(emptySchedule, "2026-10-30");
    expect(res.isFinalDay).toBe(true);
    expect(res.remainingWorkingDays).toBe(1);
    expect(res.remainingCalendarDays).toBe(1);
    expect(res.completedWorkingDays).toBe(67);
    expect(res.completedCalendarDays).toBe(93);
  });

  it("Rule 8: After end date (2026-10-31), remaining days equal 0 and completed equals 100%", () => {
    const res = calculateCountdown(emptySchedule, "2026-10-31");
    expect(res.isCompleted).toBe(true);
    expect(res.remainingWorkingDays).toBe(0);
    expect(res.remainingCalendarDays).toBe(0);
    expect(res.workingProgress).toBe(100);
    expect(res.calendarProgress).toBe(100);
  });

  it("Rule 9: Progress is clamped between 0 and 100", () => {
    const beforeRes = calculateCountdown(emptySchedule, "2026-07-01");
    expect(beforeRes.workingProgress).toBe(0);
    expect(beforeRes.calendarProgress).toBe(0);

    const afterRes = calculateCountdown(emptySchedule, "2026-11-15");
    expect(afterRes.workingProgress).toBe(100);
    expect(afterRes.calendarProgress).toBe(100);
  });

  it("Rule 10: Duplicate override is rejected by validation", () => {
    const schedule: ScheduleData = {
      ...emptySchedule,
      overrides: [{ id: "ovr_1", date: "2026-08-12", status: "holiday", label: "Existing Holiday" }],
    };
    const validation = validateOverrideInput(
      { date: "2026-08-12", status: "holiday", label: "Duplicate" },
      schedule
    );
    expect(validation.valid).toBe(false);
    expect(validation.error).toContain("รายการสำหรับวันดังกล่าวมีอยู่แล้ว");
  });

  it("Rule 11: No-op override is rejected by validation", () => {
    // Trying to add Monday as working day (already default working)
    const valWeekdayWorking = validateOverrideInput(
      { date: "2026-08-03", status: "working", label: "No op" },
      emptySchedule
    );
    expect(valWeekdayWorking.valid).toBe(false);

    // Trying to add Saturday as holiday (already default holiday)
    const valWeekendHoliday = validateOverrideInput(
      { date: "2026-08-01", status: "holiday", label: "No op" },
      emptySchedule
    );
    expect(valWeekendHoliday.valid).toBe(false);
  });
});
