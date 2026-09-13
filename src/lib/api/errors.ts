export const ERROR_CODES = {
  BAD_REQUEST: "BAD_REQUEST",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  NOT_FOUND: "NOT_FOUND",
  CONFLICT: "CONFLICT",
  RATE_LIMITED: "RATE_LIMITED",
  SERVICE_UNAVAILABLE: "SERVICE_UNAVAILABLE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];

type ErrorDefinition = {
  readonly status: number;
  readonly fallbackMessage: string;
};

const ERROR_DEFINITIONS: Record<ErrorCode, ErrorDefinition> = {
  BAD_REQUEST: { status: 400, fallbackMessage: "Yêu cầu không hợp lệ." },
  VALIDATION_ERROR: { status: 422, fallbackMessage: "Dữ liệu không hợp lệ." },
  UNAUTHORIZED: { status: 401, fallbackMessage: "Bạn cần đăng nhập để tiếp tục." },
  FORBIDDEN: { status: 403, fallbackMessage: "Bạn không có quyền thực hiện thao tác này." },
  NOT_FOUND: { status: 404, fallbackMessage: "Không tìm thấy tài nguyên." },
  CONFLICT: { status: 409, fallbackMessage: "Yêu cầu xảy ra xung đột với dữ liệu hiện tại." },
  RATE_LIMITED: { status: 429, fallbackMessage: "Có quá nhiều yêu cầu. Vui lòng thử lại sau." },
  SERVICE_UNAVAILABLE: { status: 503, fallbackMessage: "Dịch vụ tạm thời không khả dụng." },
  INTERNAL_ERROR: { status: 500, fallbackMessage: "Đã xảy ra lỗi không mong muốn." },
};

export type ApiErrorBody = {
  readonly success: false;
  readonly code: ErrorCode;
  readonly message: string;
  readonly errors?: Readonly<Record<string, readonly string[]>>;
  readonly traceId: string;
  readonly timestamp: string;
  readonly path: string;
};

export class ApplicationError extends Error {
  readonly code: ErrorCode;
  readonly status: number;

  constructor(code: ErrorCode, message?: string, options?: ErrorOptions) {
    super(message ?? ERROR_DEFINITIONS[code].fallbackMessage, options);
    this.name = "ApplicationError";
    this.code = code;
    this.status = ERROR_DEFINITIONS[code].status;
  }
}

export function createTraceId(): string {
  return crypto.randomUUID();
}

export function toApiErrorResponse(
  error: unknown,
  traceId: string = createTraceId(),
  context: {
    readonly errors?: Readonly<Record<string, readonly string[]>>;
    readonly path?: string;
  } = {},
): { body: ApiErrorBody; status: number } {
  const timestamp = new Date().toISOString();
  const path = context.path ?? "/api/unknown";

  if (error instanceof ApplicationError) {
    return {
      body: {
        success: false,
        code: error.code,
        message: error.message,
        ...(context.errors ? { errors: context.errors } : {}),
        traceId,
        timestamp,
        path,
      },
      status: error.status,
    };
  }

  return {
    body: {
      success: false,
      code: ERROR_CODES.INTERNAL_ERROR,
      message: ERROR_DEFINITIONS.INTERNAL_ERROR.fallbackMessage,
      traceId,
      timestamp,
      path,
    },
    status: ERROR_DEFINITIONS.INTERNAL_ERROR.status,
  };
}
