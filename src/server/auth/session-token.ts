import "server-only";

import { createHmac, randomBytes } from "node:crypto";

import { env } from "@/config/env";

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export function hashSessionToken(token: string): string {
  return createHmac("sha256", env.AUTH_SECRET).update(token).digest("hex");
}
