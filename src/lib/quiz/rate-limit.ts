type RateLimitEntry = {
  count: number
  expiresAt: number
}

const buckets = new Map<string, RateLimitEntry>()

export function consumeRateLimit(
  key: string,
  limit: number = 5,
  windowMs: number = 10_000
): { allowed: true } | { allowed: false; retryAfter: number } {
  const now = Date.now()
  const existing = buckets.get(key)

  if (!existing || existing.expiresAt <= now) {
    buckets.set(key, { count: 1, expiresAt: now + windowMs })
    return { allowed: true }
  }

  if (existing.count >= limit) {
    return { allowed: false, retryAfter: Math.max(0, existing.expiresAt - now) }
  }

  existing.count += 1
  return { allowed: true }
}

export function clearExpiredLimits(): void {
  const now = Date.now()
  for (const [key, entry] of buckets.entries()) {
    if (entry.expiresAt <= now) {
      buckets.delete(key)
    }
  }
}
