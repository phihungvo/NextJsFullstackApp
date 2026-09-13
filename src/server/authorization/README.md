# Authorization

Server-only authorization policy gồm RBAC, permission checks và deny-by-default. Backend là
enforcement point; frontend chỉ hỗ trợ UX bằng helper thuần dữ liệu trong
`src/features/auth/permissions.ts` và không thể thay thế guard server.

## Server contract

- `requireAuth()` lấy session hiện tại và trả `401` nếu anonymous, expired, revoked, inactive hoặc
  deleted.
- `getUserPermissionCodes(userId)` resolve permission qua `UserRole → RolePermission → Permission`.
- `hasPermission(userId, permissionCode)` kiểm tra permission trực tiếp từ database.
- `requirePermission(permissionCode)` chạy `requireAuth()` trước, sau đó trả `403` nếu thiếu quyền.
- Permission codes là dữ liệu database có thể mở rộng; `PERMISSIONS` chỉ là typed catalog cho các
  capability đã biết trong application code, không phải allowlist frontend.

Mọi route/service private phải gọi guard server trước business operation. Route Handler chỉ map
`ApplicationError` qua API response contract; không tự trả stack trace hoặc tự quyết định quyền.
