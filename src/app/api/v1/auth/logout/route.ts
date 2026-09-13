import { apiError, apiSuccess } from "@/lib/api/response";
import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import { clearSessionCookie } from "@/server/auth/cookies";
import { getCurrentSessionToken, revokeSession } from "@/server/auth/session";

const PATH = "/api/v1/auth/logout";

export async function POST(): Promise<Response> {
  try {
    const token = await getCurrentSessionToken();
    if (token) {
      await revokeSession(token);
    }

    const response = apiSuccess({ success: true });
    clearSessionCookie(response);
    return response;
  } catch {
    return apiError(new ApplicationError(ERROR_CODES.INTERNAL_ERROR), { path: PATH });
  }
}
