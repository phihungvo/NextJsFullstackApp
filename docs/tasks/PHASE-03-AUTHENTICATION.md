# PHASE 03 — AUTHENTICATION

## Mục tiêu

Triển khai authentication web-first cho Modular Monolith: credential login an toàn, opaque
database-backed session, logout/revoke, current-user endpoint và rate limiting. Authentication phải
giữ server/client boundary rõ ràng, không expose secret và làm nền cho Phase 04 — Authorization.

## Dependencies

- P02 — Database: DONE.
- P01 — Foundation: DONE.
- `DATABASE_URL`, `REDIS_URL` và `AUTH_SECRET` đã có trong environment contract.
- Product proposition và role matrix chi tiết vẫn provisional; Phase 03 chỉ dùng identity/role baseline
  hiện có, không tự mở rộng authorization policy.

## Tasks

### P03-T01 — Authentication architecture

Status: DONE

#### Acceptance Criteria

- [x] Dùng opaque random session token trong HttpOnly cookie.
- [x] Database chỉ lưu HMAC-SHA-256 token hash, không lưu raw token.
- [x] Session có expiry, revoke state và last-seen tracking.
- [x] Không dùng access/refresh token pair trong web-only MVP.

#### Verification

- [x] Architecture review trong `src/server/auth/README.md` và schema.
- [x] Cookie flags được kiểm tra trong auth constants/cookie boundary.
- [x] Token hash unit test pass.

### P03-T02 — Password hashing

Status: DONE

#### Acceptance Criteria

- [x] Password dùng Argon2id.
- [x] User không tồn tại vẫn chạy dummy hash verification để giảm user-enumeration timing signal.
- [x] Password/hash không xuất hiện trong API response hoặc log.
- [x] Seed password chỉ lấy từ environment development và không log giá trị.

#### Verification

- [x] Password unit tests pass cho đúng password, sai password, thiếu hash và malformed hash.
- [x] Seed/schema review xác nhận password chỉ lưu hash.

### P03-T03 — Login

Status: DONE

#### Acceptance Criteria

- [x] `POST /api/v1/auth/login` validate JSON bằng Zod ở server.
- [x] Credential hợp lệ tạo session và set cookie.
- [x] Credential sai, user không tồn tại hoặc account không active dùng generic auth error.
- [x] Login response không chứa `passwordHash` hoặc raw session token.

#### Verification

- [x] Route tests cover successful login and generic credential failure.
- [x] Runtime smoke test cover valid/invalid login trên temporary MySQL + Redis.

### P03-T04 — Logout

Status: DONE

#### Acceptance Criteria

- [x] `POST /api/v1/auth/logout` revoke current session nếu cookie tồn tại.
- [x] Cookie được clear với cùng security policy.
- [x] Logout idempotent khi request không có session.

#### Verification

- [x] Route test xác nhận revoke và clear cookie.
- [x] Runtime smoke test xác nhận session không dùng lại được sau logout.

### P03-T05 — Session

Status: DONE

#### Acceptance Criteria

- [x] Có `Session` model và migration riêng, FK đến `User` với cascade delete.
- [x] Session hết hạn/revoked hoặc user inactive/deleted không được authenticate.
- [x] Session TTL baseline là 8 giờ; `lastSeenAt` cập nhật không thường xuyên hơn mỗi 5 phút.
- [x] Cookie production dùng `__Host-session`, `HttpOnly`, `Secure`, `SameSite=Lax`, `Path=/`.

#### Verification

- [x] `prisma validate`, `prisma generate` và migration diff pass.
- [x] Runtime migration/seed/session flow pass trên temporary services.

### P03-T06 — Refresh token nếu cần

Status: SKIPPED — có chủ đích

#### Decision

MVP hiện là web-only và dùng opaque session 8 giờ trong cookie. Chưa có mobile client, API consumer
độc lập hoặc yêu cầu access/refresh token pair; thêm refresh endpoint sẽ tăng rotation/replay surface
mà chưa có use case. Nếu xuất hiện consumer ngoài web hoặc yêu cầu session dài hạn, phải tạo decision
record, migration và test rotation/revoke riêng trước khi đổi contract.

### P03-T07 — Me endpoint

Status: DONE

#### Acceptance Criteria

- [x] `GET /api/v1/auth/me` trả public user fields khi session hợp lệ.
- [x] Anonymous, expired, revoked, inactive hoặc deleted session trả `401` generic.
- [x] Response không trả password hash, token hoặc secret.

#### Verification

- [x] Route tests cover authenticated and unauthorized responses.
- [x] Runtime smoke test cover me trước và sau logout.

### P03-T08 — Rate limiting

Status: DONE

#### Acceptance Criteria

- [x] Login có Redis-backed limit 5 attempts trong 60 giây theo email + client address.
- [x] Redis không khả dụng thì request bị fail-closed, không fallback in-memory trong production.
- [x] Rate-limit response dùng error contract `429` và không leak credential state.
- [x] Proxy header trust assumption được ghi nhận; production phải đặt trusted proxy boundary đúng.

#### Verification

- [x] Route test cover `429` và không query credentials khi đã bị giới hạn.
- [x] Runtime smoke test cover attempt thứ sáu trả `429`.

### P03-T09 — Authentication tests

Status: DONE

#### Acceptance Criteria

- [x] Có Vitest script/config và test suite không phụ thuộc production/shared database.
- [x] Test cover login thành công, sai password, user không tồn tại, logout, me và unauthorized.
- [x] Test cover password hashing, opaque token và response non-exposure.

#### Verification

- [x] `pnpm test` — PASS.
- [x] Runtime auth smoke — PASS với temporary MySQL và Redis; credentials/cookie values không ghi vào log.

## Security decisions

| Area        | P03 decision                                                      | Caveat                                                         |
| ----------- | ----------------------------------------------------------------- | -------------------------------------------------------------- |
| Session     | Opaque DB-backed session, token random 32 bytes                   | Không phù hợp external token federation nếu chưa thiết kế thêm |
| Persistence | HMAC-SHA-256 token hash với `AUTH_SECRET`                         | Đổi secret sẽ invalidate toàn bộ session hiện có               |
| Cookie      | HttpOnly; Secure + `__Host-` ở production; SameSite Lax; Path `/` | HTTPS production và domain/proxy policy phải được xác nhận     |
| Lifetime    | 8 giờ, absolute expiry; last-seen mỗi 5 phút                      | Idle timeout riêng chưa có requirement                         |
| Password    | Argon2id; dummy hash khi user không tồn tại                       | Cost tuning cần benchmark trong P09/performance review         |
| Rate limit  | Redis, 5 attempts/60 giây, email + client address                 | `x-forwarded-for` chỉ an toàn khi proxy chain được kiểm soát   |

## Phase verification

- P03-T01 verification: **PASS**.
- P03-T02 verification: **PASS**.
- P03-T03 verification: **PASS**.
- P03-T04 verification: **PASS**.
- P03-T05 verification: **PASS**.
- P03-T06 verification: **SKIPPED — documented decision**.
- P03-T07 verification: **PASS**.
- P03-T08 verification: **PASS**.
- P03-T09 verification: **PASS**.
- Remaining P03 tasks: **NONE**.
- Phase status: **DONE**.

## Residual decisions after P03

- Product owner sign-off cho audience/proposition, public product lifecycle và role matrix chi tiết.
- Trusted proxy/header configuration của môi trường production.
- Session cleanup job/retention policy nếu traffic khiến bảng `Session` tăng đáng kể.
- Refresh-token strategy chỉ xem xét khi có external client hoặc yêu cầu long-lived session.
- Security review P09 cần đánh giá cookie policy, secret rotation, Argon2 cost, brute-force behavior và
  session revocation khi đổi trạng thái user.
