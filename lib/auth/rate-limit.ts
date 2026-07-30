import { Redis } from "@upstash/redis";

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

// In-memory fallback if Redis is not configured
const failedAttemptsMap = new Map<string, { count: number; firstFailedAt: number }>();

let redisClient: Redis | null = null;
try {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    redisClient = new Redis({ url, token });
  }
} catch (e) {
  console.warn("Failed to initialize Upstash Redis for rate limiting, using in-memory fallback.", e);
}

export async function checkLoginRateLimit(ip: string = "global"): Promise<{ allowed: boolean; remaining: number }> {
  const now = Date.now();

  if (redisClient) {
    try {
      const entry = await redisClient.get<{ count: number; firstFailedAt: number }>(`rate-limit:login:${ip}`);
      if (!entry) {
        return { allowed: true, remaining: MAX_ATTEMPTS };
      }
      if (now - entry.firstFailedAt > WINDOW_MS) {
        await redisClient.del(`rate-limit:login:${ip}`);
        return { allowed: true, remaining: MAX_ATTEMPTS };
      }
      if (entry.count >= MAX_ATTEMPTS) {
        return { allowed: false, remaining: 0 };
      }
      return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
    } catch (e) {
      console.warn("Redis error in checkLoginRateLimit, falling back to memory.", e);
    }
  }

  // Fallback
  const entry = failedAttemptsMap.get(ip);
  if (!entry) {
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }
  if (now - entry.firstFailedAt > WINDOW_MS) {
    failedAttemptsMap.delete(ip);
    return { allowed: true, remaining: MAX_ATTEMPTS };
  }
  if (entry.count >= MAX_ATTEMPTS) {
    return { allowed: false, remaining: 0 };
  }
  return { allowed: true, remaining: MAX_ATTEMPTS - entry.count };
}

export async function recordFailedLogin(ip: string = "global"): Promise<void> {
  const now = Date.now();

  if (redisClient) {
    try {
      const key = `rate-limit:login:${ip}`;
      const entry = await redisClient.get<{ count: number; firstFailedAt: number }>(key);
      if (!entry || now - entry.firstFailedAt > WINDOW_MS) {
        await redisClient.set(key, { count: 1, firstFailedAt: now }, { ex: Math.floor(WINDOW_MS / 1000) });
      } else {
        await redisClient.set(key, { count: entry.count + 1, firstFailedAt: entry.firstFailedAt }, { ex: Math.floor(WINDOW_MS / 1000) });
      }
      return;
    } catch (e) {
      console.warn("Redis error in recordFailedLogin, falling back to memory.", e);
    }
  }

  // Fallback
  const entry = failedAttemptsMap.get(ip);
  if (!entry || now - entry.firstFailedAt > WINDOW_MS) {
    failedAttemptsMap.set(ip, { count: 1, firstFailedAt: now });
  } else {
    entry.count += 1;
  }
}

export async function resetFailedLogin(ip: string = "global"): Promise<void> {
  if (redisClient) {
    try {
      await redisClient.del(`rate-limit:login:${ip}`);
      return;
    } catch (e) {
      console.warn("Redis error in resetFailedLogin, falling back to memory.", e);
    }
  }
  failedAttemptsMap.delete(ip);
}
