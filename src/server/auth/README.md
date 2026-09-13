# Authentication

Server-only authentication/session implementation. Cookie, secret và session data không được expose
ra client bundle hoặc log.

## Session decision

MVP dùng opaque database-backed session, không dùng access/refresh token pair. Cookie chỉ chứa random
token; database lưu HMAC-SHA-256 token hash với `AUTH_SECRET`, có expiry, last-seen và revoke state.
Mô hình này phù hợp web-only MVP, giảm refresh rotation surface và không cần lưu token trong
`localStorage`/`sessionStorage`. Nếu có mobile client hoặc token federation, phải tạo decision/migration
mới thay vì âm thầm đổi contract.

## Routes

- `POST /api/v1/auth/login`: validate, Redis rate limit, generic credential error, create session.
- `POST /api/v1/auth/logout`: revoke current session và expire cookie.
- `GET /api/v1/auth/me`: trả public user fields và role codes khi session hợp lệ.
- Refresh endpoint: `SKIPPED` trong P03 vì không có refresh-token strategy.

Password dùng Argon2id; login query chỉ chọn field cần thiết, response không bao gồm `passwordHash`.
