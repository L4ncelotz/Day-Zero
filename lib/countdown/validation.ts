import { z } from "zod";
import { COUNTDOWN_CONFIG } from "../config";
import { parseDateOnly } from "./dates";
import { ScheduleOverride, ScheduleData } from "./types";

export const scheduleOverrideSchema = z.object({
  id: z.string().min(1),
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format YYYY-MM-DD")
    .refine(
      (val) => val >= COUNTDOWN_CONFIG.startDate && val <= COUNTDOWN_CONFIG.endDate,
      `Date must be between ${COUNTDOWN_CONFIG.startDate} and ${COUNTDOWN_CONFIG.endDate}`
    ),
  status: z.enum(["working", "holiday"]),
  label: z.string().max(80, "Label cannot exceed 80 characters"),
});

export const scheduleDataSchema = z.object({
  version: z.literal(1),
  lastUpdatedAt: z.string(),
  overrides: z.array(scheduleOverrideSchema),
});

/**
 * Validates whether an override is a no-op (e.g. Mon-Fri set to working, or Sat-Sun set to holiday)
 */
export function isNoOpOverride(dateKey: string, status: "working" | "holiday"): boolean {
  const date = parseDateOnly(dateKey);
  const day = date.getDay();
  const isWeekend = day === 0 || day === 6;

  if (isWeekend && status === "holiday") {
    return true; // Weekend is already a holiday by default
  }
  if (!isWeekend && status === "working") {
    return true; // Weekday is already a working day by default
  }
  return false;
}

/**
 * Validates a new or updated override against existing schedule data.
 */
export function validateOverrideInput(
  override: Omit<ScheduleOverride, "id"> & { id?: string },
  existingData: ScheduleData
): { valid: boolean; error?: string } {
  const parseResult = scheduleOverrideSchema.omit({ id: true }).safeParse(override);
  if (!parseResult.success) {
    return { valid: false, error: parseResult.error.errors[0]?.message || "Invalid input" };
  }

  // Duplicate check (ignore self if editing)
  const isDuplicate = existingData.overrides.some(
    (item) => item.date === override.date && item.id !== override.id
  );
  if (isDuplicate) {
    return { valid: false, error: "รายการสำหรับวันดังกล่าวมีอยู่แล้ว กรุณาแก้ไขรายการเดิมแทน" };
  }

  // No-op check
  if (isNoOpOverride(override.date, override.status)) {
    const defaultType = override.status === "working" ? "วันทำงานปกติ" : "วันหยุดปกติ";
    return {
      valid: false,
      error: `วันที่เลือกเป็น${defaultType}อยู่แล้ว ไม่จำเป็นต้องบันทึกเป็นวันยกเว้น`,
    };
  }

  return { valid: true };
}
