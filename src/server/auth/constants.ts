import "server-only";

import { env } from "@/config/env";

export const SESSION_TTL_SECONDS = 60 * 60 * 8;
export const SESSION_COOKIE_NAME = env.NODE_ENV === "production" ? "__Host-session" : "session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};
