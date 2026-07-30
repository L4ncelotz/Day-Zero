const failedAttemptsMap = new Map<string, { count: number; firstFailedAt: number }>();

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 minutes

export function checkLoginRateLimit(ip: string = "global"): { allowed: boolean; remaining: number } {
  const now = Date.now();
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

export function recordFailedLogin(ip: string = "global"): void {
  const now = Date.now();
  const entry = failedAttemptsMap.get(ip);

  if (!entry || now - entry.firstFailedAt > WINDOW_MS) {
    failedAttemptsMap.set(ip, { count: 1, firstFailedAt: now });
  } else {
    entry.count += 1;
  }
}

export function resetFailedLogin(ip: string = "global"): void {
  failedAttemptsMap.delete(ip);
}
