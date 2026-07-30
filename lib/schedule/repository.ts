import { unstable_cache } from "next/cache";
import { getRedisClient, REDIS_SCHEDULE_KEY } from "./upstash";
import { BASELINE_FALLBACK_SCHEDULE } from "./fallback";
import { ScheduleData } from "../countdown/types";
import { scheduleDataSchema } from "../countdown/validation";

export const SCHEDULE_CACHE_TAG = "internship-schedule";

export type GetScheduleResult = {
  data: ScheduleData;
  usingFallback: boolean;
  error?: string;
};

// Inner function — reads Upstash directly, no caching layer.
// Wrapped by unstable_cache below so callers always get the cached version.
async function fetchScheduleFromRedis(): Promise<GetScheduleResult> {
  const redis = getRedisClient();

  if (!redis) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "[CONFIG] UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required in production. " +
          "Set these environment variables and redeploy."
      );
    }

    console.warn("[FALLBACK] Upstash Redis credentials not found. Using baseline fallback schedule (dev only).");
    return { data: BASELINE_FALLBACK_SCHEDULE, usingFallback: true };
  }

  try {
    const rawData = await redis.get<unknown>(REDIS_SCHEDULE_KEY);
    if (!rawData) {
      return { data: BASELINE_FALLBACK_SCHEDULE, usingFallback: false };
    }

    const parseResult = scheduleDataSchema.safeParse(rawData);
    if (!parseResult.success) {
      console.error("Redis schedule payload invalid structure:", parseResult.error);
      return { data: BASELINE_FALLBACK_SCHEDULE, usingFallback: true, error: "Invalid schedule payload" };
    }

    return { data: parseResult.data, usingFallback: false };
  } catch (err) {
    console.error("Failed to read schedule from Upstash Redis:", err);
    return { data: BASELINE_FALLBACK_SCHEDULE, usingFallback: true, error: String(err) };
  }
}

// Cached version — tagged so saveSchedule can invalidate it immediately.
// revalidate: 3600 is a safety net in case the tag invalidation is missed.
export const getSchedule = unstable_cache(fetchScheduleFromRedis, [SCHEDULE_CACHE_TAG], {
  tags: [SCHEDULE_CACHE_TAG],
  revalidate: 3600,
});

export async function saveSchedule(scheduleData: ScheduleData): Promise<{ success: boolean; error?: string }> {
  const redis = getRedisClient();

  if (!redis) {
    return {
      success: false,
      error: "Upstash Redis credentials missing. Admin schedule editing is disabled in fallback mode.",
    };
  }

  try {
    // Sort overrides ascending by date before saving
    const sortedData: ScheduleData = {
      ...scheduleData,
      lastUpdatedAt: new Date().toISOString(),
      overrides: [...scheduleData.overrides].sort((a, b) => a.date.localeCompare(b.date)),
    };

    await redis.set(REDIS_SCHEDULE_KEY, sortedData);
    return { success: true };
  } catch (err) {
    console.error("Failed to write schedule to Upstash Redis:", err);
    return { success: false, error: "Failed to persist schedule to Redis storage." };
  }
}
