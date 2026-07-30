import { COUNTDOWN_CONFIG } from "../config";

/**
 * Parses YYYY-MM-DD string safely into a Date object at noon (12:00:00)
 * to avoid DST shift issues.
 */
export function parseDateOnly(value: string): Date {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

/**
 * Formats a Date object into YYYY-MM-DD string.
 */
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Gets the current date string (YYYY-MM-DD) in Asia/Bangkok timezone.
 */
export function getBangkokDateKey(now = new Date()): string {
  const formatted = new Intl.DateTimeFormat("en-CA", {
    timeZone: COUNTDOWN_CONFIG.timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  return formatted;
}

/**
 * Generates an array of date keys (YYYY-MM-DD) between startDate and endDate (inclusive).
 */
export function generateDateRange(startDateKey: string, endDateKey: string): string[] {
  const dates: string[] = [];
  let current = parseDateOnly(startDateKey);
  const end = parseDateOnly(endDateKey);

  while (current <= end) {
    dates.push(formatDateKey(current));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

/**
 * Format date for display in Thai/English (e.g. "29 Jul 2026", "WED 12 AUG")
 */
export function formatDisplayDate(
  dateKey: string,
  options: { locale?: "th" | "en"; format?: "full" | "short" | "dayName" } = {}
): string {
  const date = parseDateOnly(dateKey);
  const { locale = "en", format = "short" } = options;

  if (format === "dayName") {
    const dayNamesEn = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const dayNamesTh = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    return locale === "th" ? dayNamesTh[date.getDay()] : dayNamesEn[date.getDay()];
  }

  if (format === "full") {
    const monthNamesEn = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    return `${date.getDate()} ${monthNamesEn[date.getMonth()]} ${date.getFullYear()}`;
  }

  // Short format: "29 Jul 2026"
  const monthShortEn = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${date.getDate()} ${monthShortEn[date.getMonth()]} ${date.getFullYear()}`;
}
