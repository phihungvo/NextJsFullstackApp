# Logging foundation

`logger.ts` cung cấp structured logging server-only cho Modular Monolith. Mỗi entry có JSON
`timestamp`, `level` và `event`; `traceId`/`requestId` được giữ ở top-level khi caller cung cấp để
liên kết với API error response và request context.

## Safety policy

- Chỉ import logger từ Server Component, Route Handler, service hoặc worker server-side.
- Context phải dùng event name ổn định, không đưa raw request body hoặc secret vào log.
- Redaction áp dụng đệ quy theo key cho password, passcode, token, cookie, secret, API key,
  authorization, credential, private key, database URL và Redis URL.
- Chuỗi có dạng `Bearer ...` hoặc `token=...` cũng được redacted.
- Error chỉ ghi `name` và message đã redacted; không serialize `stack` hoặc `cause`.
- Không dùng logger để thay thế audit log hoặc lưu dữ liệu nghiệp vụ.

Ví dụ sử dụng ở server boundary:

```ts
logger.info("request.completed", {
  requestId,
  traceId,
  method,
  route,
  durationMs,
});
```
