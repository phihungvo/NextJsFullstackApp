# API utilities

Shared API client/response helpers. Route Handler vẫn phải đi qua validation, auth, authorization,
service và repository theo đúng boundary.

## Error contract

`errors.ts` là central mapping cho lỗi ứng dụng và không phụ thuộc Next.js. Route Handler dùng
`apiError()`/`toApiErrorResponse()` để trả response có cấu trúc ổn định:

```json
{
  "success": false,
  "code": "NOT_FOUND",
  "message": "Không tìm thấy tài nguyên.",
  "traceId": "...",
  "timestamp": "...",
  "path": "/api/v1/products/unknown"
}
```

Chỉ `ApplicationError` mới được đưa message ra response; lỗi không xác định luôn được map thành
`INTERNAL_ERROR` với message chung. `stack`, `cause`, secret và chi tiết infrastructure không được
serialize. Validation dùng `VALIDATION_ERROR` (`422`) và có thể thêm `errors` theo field. `traceId` dùng
để liên kết response với logging context ở P01-T09. Success dùng `{ success: true, data, message?, meta? }`;
list response đặt pagination metadata trong `meta`.
