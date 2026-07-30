import { COUNTDOWN_CONFIG } from "../config";
import { ScheduleData } from "../countdown/types";

export const BASELINE_FALLBACK_SCHEDULE: ScheduleData = {
  version: 1,
  lastUpdatedAt: `${COUNTDOWN_CONFIG.startDate}T00:00:00+07:00`,
  overrides: [],
};
