# API routes

Route Handlers phải đi qua parse/validation, authentication, authorization, service và repository khi
domain behavior được thêm. P05 đã áp dụng boundary này cho các resource Product, User, Role và
Permission dưới `/api/v1`.

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

Database/Redis readiness checks vẫn được tách khỏi liveness endpoint; health contract chưa được mở rộng
để tránh coi placeholder environment là dependency đã sẵn sàng. P05 đã kiểm chứng các dependency thực tế
qua runtime smoke test riêng.
