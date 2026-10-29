/**
 * 进程内限流 + 客户端 IP 提取
 *
 * 说明：内存 Map 只在单个实例内有效，多实例部署时各自计数。
 * 对官网这种量级足够；真要严格，得换 Redis/Upstash。
 */

type Bucket = { count: number; resetAt: number };

export type LimitResult = { ok: true } | { ok: false; retryAfter: number };

export function createLimiter(max: number, windowMs: number) {
  const buckets = new Map<string, Bucket>();

  return function check(key: string): LimitResult {
    const now = Date.now();

    // 顺带清理过期桶，避免 Map 无限增长
    if (buckets.size > 800) {
      for (const [k, v] of buckets) {
        if (now > v.resetAt) buckets.delete(k);
      }
    }

    const bucket = buckets.get(key);
    if (!bucket || now > bucket.resetAt) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      return { ok: true };
    }
    if (bucket.count >= max) {
      return { ok: false, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) };
    }
    bucket.count += 1;
    return { ok: true };
  };
}

/** 取真实客户端 IP（Vercel 会带 x-forwarded-for） */
export function clientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]!.trim();
  return req.headers.get("x-real-ip")?.trim() || "anonymous";
}
