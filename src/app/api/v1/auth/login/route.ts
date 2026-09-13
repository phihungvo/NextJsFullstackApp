import { z } from "zod";

import { apiError, apiSuccess } from "@/lib/api/response";
import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import { authenticateCredentials } from "@/server/auth/credentials";
import { setSessionCookie } from "@/server/auth/cookies";
import { createSession } from "@/server/auth/session";
import { consumeLoginRateLimit, getClientAddress } from "@/server/auth/rate-limit";
import { toPublicUser } from "@/server/auth/public-user";

const loginSchema = z.object({
  email: z.email().transform((value) => value.toLowerCase()),
  password: z.string().min(1).max(128),
});

const GENERIC_AUTH_ERROR = "Email hoặc mật khẩu không đúng.";

function createLoginIdentifier(request: Request, email: string): string {
  return `${getClientAddress(request)}:${email}`;
}

export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return apiError(new ApplicationError(ERROR_CODES.BAD_REQUEST));
  }

  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return apiError(new ApplicationError(ERROR_CODES.BAD_REQUEST));
  }

  try {
    const rateLimit = await consumeLoginRateLimit(
      createLoginIdentifier(request, parsed.data.email),
    );
    if (!rateLimit.allowed) {
      return apiError(new ApplicationError(ERROR_CODES.RATE_LIMITED));
    }

    const user = await authenticateCredentials(parsed.data.email, parsed.data.password);
    if (!user) {
      return apiError(new ApplicationError(ERROR_CODES.UNAUTHORIZED, GENERIC_AUTH_ERROR));
    }

    const session = await createSession(user.id);
    const response = apiSuccess({
      user: toPublicUser(user),
      expiresAt: session.expiresAt.toISOString(),
    });
    setSessionCookie(response, session.token, session.expiresAt);
    return response;
  } catch {
    return apiError(new ApplicationError(ERROR_CODES.SERVICE_UNAVAILABLE));
  }
}
