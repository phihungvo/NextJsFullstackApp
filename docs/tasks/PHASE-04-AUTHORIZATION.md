# PHASE 04 — AUTHORIZATION

## Mục tiêu

Hoàn thiện authorization cho Modular Monolith bằng RBAC kết hợp permission-based checks. Backend là
enforcement point với nguyên tắc deny-by-default; frontend chỉ dùng permission data để điều chỉnh UX.

## Dependencies

- P03 — Authentication: DONE.
- P02 — Database: DONE; `UserRole` và `RolePermission` là explicit join tables.
- Permission catalog và role matrix chi tiết vẫn là provisional theo product requirements.

## Baseline policy

- Permission được resolve từ `User → UserRole → Role → RolePermission → Permission`.
- `ADMIN` seed có toàn bộ permission baseline; `USER` seed chỉ có `PRODUCT_VIEW`.
- Không có wildcard hoặc implicit permission inheritance.
- Permission code không tồn tại hoặc không được gán đều bị deny.
- `requireAuth()` chạy trước permission check; anonymous là `401`, authenticated nhưng thiếu quyền là
  `403`.
- `PERMISSIONS` là typed catalog cho code path đã biết; database vẫn là nguồn permission extensible.

## Tasks

### P04-T01 — RBAC

Status: DONE

#### Acceptance Criteria

- [x] Role membership được resolve qua database relations.
- [x] Permission được union giữa nhiều role và loại duplicate.
- [x] Không có permission mặc định ngoài dữ liệu role/permission được gán.

#### Verification

- [x] Authorization unit test resolve nhiều role và duplicate permission.
- [x] Runtime seed verification xác nhận Admin/User baseline.

### P04-T02 — Permission model

Status: DONE

#### Acceptance Criteria

- [x] Dùng `Permission` model và `RolePermission` explicit join table từ P02.
- [x] Permission code unique và có thể mở rộng bằng dữ liệu database.
- [x] Typed `PERMISSIONS` catalog không được dùng làm frontend allowlist.

#### Verification

- [x] Prisma schema/migration review.
- [x] `getUserPermissionCodes()` query chỉ đi qua server authorization service.

### P04-T03 — requireAuth

Status: DONE

#### Acceptance Criteria

- [x] `requireAuth()` trả public user khi session hợp lệ.
- [x] Anonymous/expired/revoked/inactive/deleted user nhận `401`.
- [x] Không trả password hash, raw token hoặc secret.

#### Verification

- [x] Unit test xác nhận anonymous bị từ chối trước permission query.
- [x] Reuses P03 session validity checks làm authentication source of truth.

### P04-T04 — requirePermission

Status: DONE

#### Acceptance Criteria

- [x] `requirePermission(permissionCode)` luôn gọi `requireAuth()` trước.
- [x] User có permission được tiếp tục.
- [x] User thiếu permission nhận `ApplicationError(FORBIDDEN)` với HTTP `403`.
- [x] Permission code không biết/không gán bị deny.

#### Verification

- [x] Tests cover allowed Admin permission và denied permission.
- [x] Runtime probe cover Admin allowed, User denied.

### P04-T05 — Frontend permission helper

Status: DONE

#### Acceptance Criteria

- [x] Có helper thuần dữ liệu `can(permissions, required)` cho một hoặc nhiều permission.
- [x] Helper không truy cập Prisma, session, secret hoặc server module.
- [x] Empty permission set deny-by-default.

#### Verification

- [x] Frontend helper unit tests pass.
- [x] Helper được document là UX-only, không phải security boundary.

### P04-T06 — Permission middleware/service

Status: DONE

#### Acceptance Criteria

- [x] `getUserPermissionCodes()` là service resolve permission từ database.
- [x] `hasPermission()` kiểm tra trực tiếp database và không tin client-provided permissions.
- [x] `requirePermission()` là server guard dùng được trong Route Handler/service.
- [x] Route Handler không chứa permission query hoặc policy branching lặp lại.

#### Verification

- [x] Service tests cover database relation shape, allow/deny và auth-first order.
- [x] Server-only boundary được giữ bởi `server-only`.

### P04-T07 — 403 handling

Status: DONE

#### Acceptance Criteria

- [x] Thiếu quyền map thành `403 FORBIDDEN`.
- [x] Response dùng centralized API error contract với `traceId`.
- [x] Response không expose policy internals, stack trace hoặc database detail.

#### Verification

- [x] Error mapping unit test pass với stable code/message/trace ID.

### P04-T08 — Authorization tests

Status: DONE

#### Acceptance Criteria

- [x] Test user không có permission.
- [x] Test user có permission.
- [x] Test Admin có đầy đủ permission baseline.
- [x] Test `401`, `403` và frontend deny-by-default.

#### Verification

- [x] `pnpm test` — PASS (`16` tests).
- [x] Runtime RBAC probe — PASS trên temporary MySQL + seeded roles/permissions.

## Security decisions

| Area        | P04 decision                                                | Caveat                                                   |
| ----------- | ----------------------------------------------------------- | -------------------------------------------------------- |
| Enforcement | Backend service guard; frontend chỉ phản ánh capability     | Mọi private route/service phải gọi guard                 |
| Policy      | Exact permission code, deny-by-default, không wildcard      | Role matrix/product sign-off vẫn provisional             |
| Resolution  | Database là source of truth; nhiều role union permission    | Cần cache invalidation nếu tối ưu bằng Redis sau này     |
| Error       | Anonymous `401`, thiếu quyền `403` qua centralized contract | Không leak permission names/policy internals trong error |
| Frontend    | `can()` chỉ là UX helper trên public permission data        | Không dùng để bảo vệ mutation/API                        |

## Phase verification

- P04-T01 verification: **PASS**.
- P04-T02 verification: **PASS**.
- P04-T03 verification: **PASS**.
- P04-T04 verification: **PASS**.
- P04-T05 verification: **PASS**.
- P04-T06 verification: **PASS**.
- P04-T07 verification: **PASS**.
- P04-T08 verification: **PASS**.
- Remaining P04 tasks: **NONE**.
- Phase status: **DONE**.

## Residual decisions after P04

- Product owner sign-off role matrix/system-role protection.
- Chính sách cache/invalidation permission nếu traffic yêu cầu; hiện query authoritative từ MySQL.
- Audit log cho role/permission assignment nếu product/compliance yêu cầu.
- Authorization E2E sẽ được mở rộng khi dashboard/API mutation xuất hiện ở P05–P08.
