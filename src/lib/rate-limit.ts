type Bucket = {
  count: number;
  resetAt: number;
};

const windows = new Map<string, Bucket>();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_HITS = 5;

export function rateLimit(key: string) {
  const now = Date.now();
  const current = windows.get(key);

  if (!current || now > current.resetAt) {
    windows.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true, remaining: MAX_HITS - 1 };
  }

  if (current.count >= MAX_HITS) {
    return { ok: false, remaining: 0, retryAt: current.resetAt };
  }

  current.count += 1;
  return { ok: true, remaining: MAX_HITS - current.count };
}
