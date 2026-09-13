import { NextResponse } from "next/server";

import { createTraceId, toApiErrorResponse } from "./errors";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export type ApiSuccessBody<T, TMeta = never> = {
  readonly success: true;
  readonly data: T;
  readonly message?: string;
  readonly meta?: TMeta;
};

export type ApiResponseContext = {
  readonly errors?: Readonly<Record<string, readonly string[]>>;
  readonly path?: string;
};

export function apiSuccess<T, TMeta = never>(
  data: T,
  status = 200,
  options: { readonly message?: string; readonly meta?: TMeta } = {},
): NextResponse<ApiSuccessBody<T, TMeta>> {
  const body = {
    success: true as const,
    data,
    ...(options.message ? { message: options.message } : {}),
    ...(options.meta ? { meta: options.meta } : {}),
  } as ApiSuccessBody<T, TMeta>;

  return NextResponse.json(body, {
    status,
    headers: NO_STORE_HEADERS,
  });
}

export function apiError(error: unknown, context: ApiResponseContext = {}): NextResponse {
  const traceId = createTraceId();
  const mapped = toApiErrorResponse(error, traceId, context);

  return NextResponse.json(mapped.body, {
    status: mapped.status,
    headers: {
      ...NO_STORE_HEADERS,
      "X-Trace-Id": traceId,
    },
  });
}
