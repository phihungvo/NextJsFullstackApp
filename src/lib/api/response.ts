import { NextResponse } from "next/server";

import { createTraceId, toApiErrorResponse } from "./errors";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export function apiSuccess<T>(data: T, status = 200): NextResponse<{ data: T }> {
  return NextResponse.json(
    { data },
    {
      status,
      headers: NO_STORE_HEADERS,
    },
  );
}

export function apiError(error: unknown): NextResponse {
  const traceId = createTraceId();
  const mapped = toApiErrorResponse(error, traceId);

  return NextResponse.json(mapped.body, {
    status: mapped.status,
    headers: {
      ...NO_STORE_HEADERS,
      "X-Trace-Id": traceId,
    },
  });
}
