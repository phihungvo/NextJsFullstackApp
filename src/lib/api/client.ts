export type ApiErrorFields = Readonly<Record<string, readonly string[]>>;

export type ApiListResult<T> = {
  readonly data: readonly T[];
  readonly meta: {
    readonly page: number;
    readonly pageSize: number;
    readonly total: number;
    readonly totalPages: number;
  };
};

type ApiSuccessPayload<T> = {
  readonly success: true;
  readonly data: T;
};

type ApiErrorPayload = {
  readonly success?: false;
  readonly code?: string;
  readonly message?: string;
  readonly errors?: ApiErrorFields;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export class ApiClientError extends Error {
  readonly status: number;
  readonly code: string;
  readonly fields?: ApiErrorFields;

  constructor(status: number, payload: ApiErrorPayload) {
    super(payload.message ?? "Không thể hoàn tất yêu cầu.");
    this.name = "ApiClientError";
    this.status = status;
    this.code = payload.code ?? "UNKNOWN_ERROR";
    this.fields = payload.errors;
  }
}

export async function apiRequest<T>(input: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      credentials: "include",
      headers,
    });
  } catch {
    throw new ApiClientError(0, {
      code: "NETWORK_ERROR",
      message: "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
    });
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!isRecord(payload)) {
    throw new ApiClientError(response.status, {
      code: "INVALID_RESPONSE",
      message: "Máy chủ trả về dữ liệu không hợp lệ.",
    });
  }

  if (!response.ok || payload.success !== true) {
    throw new ApiClientError(response.status, payload as ApiErrorPayload);
  }

  return (payload as ApiSuccessPayload<T>).data;
}

export async function apiList<T>(input: string, init?: RequestInit): Promise<ApiListResult<T>> {
  const headers = new Headers(init?.headers);
  if (init?.body && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  let response: Response;
  try {
    response = await fetch(input, {
      ...init,
      credentials: "include",
      headers,
    });
  } catch {
    throw new ApiClientError(0, {
      code: "NETWORK_ERROR",
      message: "Không thể kết nối đến máy chủ. Vui lòng thử lại.",
    });
  }

  let payload: unknown = null;
  try {
    payload = await response.json();
  } catch {
    payload = null;
  }

  if (!isRecord(payload) || !response.ok || payload.success !== true) {
    throw new ApiClientError(
      response.status,
      isRecord(payload) ? (payload as ApiErrorPayload) : {},
    );
  }

  if (!isRecord(payload.meta)) {
    throw new ApiClientError(response.status, {
      code: "INVALID_RESPONSE",
      message: "Danh sách trả về thiếu thông tin phân trang.",
    });
  }

  return {
    data: Array.isArray(payload.data) ? (payload.data as readonly T[]) : [],
    meta: payload.meta as ApiListResult<T>["meta"],
  };
}

export function queryString(values: Readonly<Record<string, string | number | undefined>>): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== "") params.set(key, String(value));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
