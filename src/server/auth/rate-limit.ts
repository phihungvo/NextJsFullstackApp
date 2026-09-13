import "server-only";

import { createHash } from "node:crypto";

import { getConnectedRedisClient } from "@/lib/redis/client";

export const LOGIN_RATE_LIMIT = {
  maxAttempts: 5,
  windowSeconds: 60,
} as const;

export type RateLimitResult = {
  readonly allowed: boolean;
  readonly remaining: number;
  readonly retryAfterSeconds: number;
};

function createRateLimitKey(identifier: string): string {
  const digest = createHash("sha256").update(identifier).digest("hex");
  return `rate-limit:login:${digest}`;
}

export async function consumeLoginRateLimit(identifier: string): Promise<RateLimitResult> {
  const client = await getConnectedRedisClient();
  const count = await client.incr(createRateLimitKey(identifier));

  if (count === 1) {
    await client.expire(createRateLimitKey(identifier), LOGIN_RATE_LIMIT.windowSeconds);
  }

  const ttl = await client.ttl(createRateLimitKey(identifier));
  return {
    allowed: count <= LOGIN_RATE_LIMIT.maxAttempts,
    remaining: Math.max(0, LOGIN_RATE_LIMIT.maxAttempts - count),
    retryAfterSeconds: Math.max(1, ttl),
  };
}

export function getClientAddress(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedAddress = forwardedFor?.split(",")[0]?.trim();
  return forwardedAddress || request.headers.get("x-real-ip")?.trim() || "unknown";
}
