import { apiError, apiSuccess } from "@/lib/api/response";
import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import { getCurrentUser } from "@/server/auth/session";

export async function GET(): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return apiError(new ApplicationError(ERROR_CODES.UNAUTHORIZED));
    }

    return apiSuccess({ user });
  } catch {
    return apiError(new ApplicationError(ERROR_CODES.INTERNAL_ERROR));
  }
}
