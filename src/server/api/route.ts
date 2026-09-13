import { apiError, apiSuccess } from "@/lib/api/response";
import { ERROR_CODES, ApplicationError } from "@/lib/api/errors";
import { zodFieldErrors } from "@/lib/validation/zod";

import type { z } from "zod";

export function apiValidationError(path: string, error: z.ZodError): Response {
  return apiError(new ApplicationError(ERROR_CODES.VALIDATION_ERROR), {
    errors: zodFieldErrors(error),
    path,
  });
}

export function apiInvalidJson(path: string): Response {
  return apiError(new ApplicationError(ERROR_CODES.VALIDATION_ERROR), {
    errors: { body: ["Request body phải là JSON hợp lệ."] },
    path,
  });
}

export function apiRouteError(path: string, error: unknown): Response {
  return apiError(error, { path });
}

export function apiList<T>(
  data: readonly T[],
  meta: {
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly totalPages: number;
  },
): Response {
  return apiSuccess(data, 200, { meta });
}
