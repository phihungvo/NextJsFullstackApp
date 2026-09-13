# API routes

Route Handlers phải đi qua validation, authentication, authorization, service và repository khi
domain behavior được thêm.

## Health endpoint

`GET /api/health` là liveness endpoint hiện chỉ xác nhận application process có thể nhận request.
Response không đọc environment secret và không trả hostname, database URL, Redis URL, stack trace
hoặc infrastructure detail:

```json
{
  "status": "ok",
  "checks": {
    "application": "ok"
  },
  "timestamp": "2026-09-13T00:00:00.000Z"
}
```

Database/Redis readiness checks chỉ được thêm sau khi client và dependency thực tế được triển khai;
không tạo check giả hoặc coi placeholder environment là dependency đã sẵn sàng.
