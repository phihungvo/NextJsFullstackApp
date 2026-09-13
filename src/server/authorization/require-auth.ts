import "server-only";

import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";

import { getCurrentUser } from "../auth/session";
import type { PublicUser } from "../auth/public-user";

export async function requireAuth(): Promise<PublicUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new ApplicationError(ERROR_CODES.UNAUTHORIZED);
  }

  return user;
}
