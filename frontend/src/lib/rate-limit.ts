const WINDOW_MS = 60 * 1000;
const MAX_REQUESTS = 30;

type Bucket = {
  count: number;
  expiresAt: number;
};

const buckets = new Map<string, Bucket>();

export function isRateLimited(identifier: string, limit = MAX_REQUESTS, windowMs = WINDOW_MS) {
  const now = Date.now();
  const bucket = buckets.get(identifier);

  if (!bucket || bucket.expiresAt <= now) {
    buckets.set(identifier, { count: 1, expiresAt: now + windowMs });
    return false;
  }

  if (bucket.count >= limit) {
    return true;
  }

  bucket.count += 1;
  buckets.set(identifier, bucket);
  return false;
}
