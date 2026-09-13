# API utilities

Shared API client/response helpers. Route Handler vẫn phải đi qua validation, auth, authorization,
service và repository theo đúng boundary.

## Error contract

`errors.ts` là central mapping cho lỗi ứng dụng và không phụ thuộc Next.js. Route Handler ở các phase
sau phải dùng `toApiErrorResponse()` để trả response có cấu trúc ổn định:

```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Không tìm thấy tài nguyên.",
    "traceId": "..."
  }
}
```

Chỉ `ApplicationError` mới được đưa message ra response; lỗi không xác định luôn được map thành
`INTERNAL_ERROR` với message chung. `stack`, `cause`, secret và chi tiết infrastructure không được
serialize. `traceId` dùng để liên kết response với logging context ở P01-T09.
