import "server-only";

const REDACTED_VALUE = "[REDACTED]";
const SENSITIVE_KEY_PARTS = [
  "password",
  "passcode",
  "token",
  "secret",
  "apikey",
  "authorization",
  "cookie",
  "credential",
  "privatekey",
  "databaseurl",
  "redisurl",
] as const;

const SENSITIVE_STRING_PATTERN =
  /((?:password|passcode|token|secret|api[_-]?key|authorization|cookie)\s*[:=]\s*)([^\s,;]+)/gi;
const BEARER_TOKEN_PATTERN = /\bBearer\s+[^\s,;]+/gi;

type JsonPrimitive = string | number | boolean | null;

export type JsonObject = { readonly [key: string]: JsonValue };
export type JsonValue = JsonPrimitive | JsonValue[] | JsonObject;
export type LogLevel = "debug" | "info" | "warn" | "error";
export type LogContext = Readonly<Record<string, unknown>>;

export type LogEntry = {
  readonly timestamp: string;
  readonly level: LogLevel;
  readonly event: string;
  readonly traceId?: string;
  readonly requestId?: string;
  readonly context?: { readonly [key: string]: JsonValue };
};

export type Logger = {
  readonly debug: (event: string, context?: LogContext) => void;
  readonly info: (event: string, context?: LogContext) => void;
  readonly warn: (event: string, context?: LogContext) => void;
  readonly error: (event: string, context?: LogContext) => void;
};

function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function isSensitiveKey(key: string): boolean {
  const normalizedKey = normalizeKey(key);
  return SENSITIVE_KEY_PARTS.some((part) => normalizedKey.includes(part));
}

function redactString(value: string): string {
  return value
    .replace(SENSITIVE_STRING_PATTERN, `$1${REDACTED_VALUE}`)
    .replace(BEARER_TOKEN_PATTERN, `Bearer ${REDACTED_VALUE}`);
}

function sanitizeObject(value: object, seen: WeakSet<object>): JsonObject {
  const sanitizedObject: { [key: string]: JsonValue } = {};
  for (const [key, nestedValue] of Object.entries(value)) {
    sanitizedObject[key] = isSensitiveKey(key)
      ? REDACTED_VALUE
      : sanitizeLogValue(nestedValue, seen);
  }

  return sanitizedObject;
}

function sanitizeLogValue(value: unknown, seen: WeakSet<object>): JsonValue {
  if (value === null) {
    return null;
  }

  if (typeof value === "string") {
    return redactString(value);
  }

  if (typeof value === "number") {
    return Number.isFinite(value) ? value : String(value);
  }

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "bigint") {
    return `[unserializable ${typeof value}]`;
  }

  if (typeof value === "function" || typeof value === "symbol") {
    return `[unserializable ${typeof value}]`;
  }

  if (value === undefined) {
    return "[undefined]";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value instanceof Error) {
    return {
      name: redactString(value.name),
      message: redactString(value.message),
    };
  }

  if (seen.has(value)) {
    return "[Circular]";
  }

  seen.add(value);

  if (Array.isArray(value)) {
    return value.map((item) => sanitizeLogValue(item, seen));
  }

  return sanitizeObject(value, seen);
}

function buildLogEntry(level: LogLevel, event: string, context: LogContext): LogEntry {
  const { traceId, requestId, ...contextWithoutIdentifiers } = context;
  const sanitizedContext = sanitizeObject(contextWithoutIdentifiers, new WeakSet<object>());

  return {
    timestamp: new Date().toISOString(),
    level,
    event: redactString(event),
    ...(typeof traceId === "string" ? { traceId: redactString(traceId) } : {}),
    ...(typeof requestId === "string" ? { requestId: redactString(requestId) } : {}),
    ...(Object.keys(sanitizedContext).length > 0 ? { context: sanitizedContext } : {}),
  };
}

function writeLog(level: LogLevel, serializedEntry: string): void {
  if (level === "error") {
    console.error(serializedEntry);
    return;
  }

  if (level === "warn") {
    console.warn(serializedEntry);
    return;
  }

  if (level === "debug") {
    console.debug(serializedEntry);
    return;
  }

  console.info(serializedEntry);
}

export function createLogger(baseContext: LogContext = {}): Logger {
  const log = (level: LogLevel, event: string, context: LogContext = {}): void => {
    const entry = buildLogEntry(level, event, { ...baseContext, ...context });
    writeLog(level, JSON.stringify(entry));
  };

  return {
    debug: (event, context) => log("debug", event, context),
    info: (event, context) => log("info", event, context),
    warn: (event, context) => log("warn", event, context),
    error: (event, context) => log("error", event, context),
  };
}

export const logger = createLogger();
