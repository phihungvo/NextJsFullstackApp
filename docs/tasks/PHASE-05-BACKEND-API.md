# PHASE 05 — BACKEND API

## Mục tiêu

Hoàn thiện backend API versioned dưới `/api/v1` cho Product, User, Role và Permission trên nền tảng
Next.js Fullstack Modular Monolith. API phải có response/error contract nhất quán, backend validation,
pagination, sorting, filtering, authorization và boundary rõ giữa Route Handler → Service → Repository.

## Dependencies

- P02 — Database: DONE; schema Product/User/Role/Permission và explicit join tables đã có.
- P03 — Authentication: DONE; opaque DB-backed session, cookie và `requireAuth()` đã có.
- P04 — Authorization: DONE; `requirePermission()` và permission baseline đã có.

## Decisions của phase

- Success response dùng `{ success: true, data, message?, meta? }`; list đặt pagination metadata trong
  `meta` gồm `page`, `pageSize`, `total`, `totalPages`.
- Error response dùng flat contract `{ success: false, code, message, errors?, traceId, timestamp, path }`.
  Unknown error luôn là `INTERNAL_ERROR`; không serialize stack, SQL, credential, token, secret hay
  internal implementation detail.
- Validation dùng Zod ở server. Pagination mặc định `page=1`, `pageSize=20`, giới hạn `pageSize=100`;
  sort field/order và resource filter đều whitelist.
- Product `DELETE` là archive/soft-delete (`ARCHIVED`, `PRIVATE`, `deletedAt`), không expose hard delete.
- User `DELETE` là soft-delete (`INACTIVE`, `deletedAt`) và revoke active sessions.
- Role `ADMIN` và `USER` là system roles: không được đổi code hoặc xóa qua API. Permission là system
  catalog nên phase này chỉ expose list/detail theo master prompt; typed permission constants không thay
  thế database catalog.
- Public product API chưa expose; các route P05 là private và được bảo vệ bằng backend permission.

## Route contract

| Resource   | Endpoints                                                             | Permission                                                           |
| ---------- | --------------------------------------------------------------------- | -------------------------------------------------------------------- |
| Product    | `GET/POST /api/v1/products`; `GET/PATCH/DELETE /api/v1/products/[id]` | `PRODUCT_VIEW`, `PRODUCT_CREATE`, `PRODUCT_UPDATE`, `PRODUCT_DELETE` |
| User       | `GET/POST /api/v1/users`; `GET/PATCH/DELETE /api/v1/users/[id]`       | `USER_VIEW`, `USER_CREATE`, `USER_UPDATE`, `USER_DELETE`             |
| Role       | `GET/POST /api/v1/roles`; `GET/PATCH/DELETE /api/v1/roles/[id]`       | `ROLE_VIEW`, `ROLE_CREATE`, `ROLE_UPDATE`, `ROLE_DELETE`             |
| Permission | `GET /api/v1/permissions`; `GET /api/v1/permissions/[id]`             | `PERMISSION_VIEW`                                                    |

Route flow bắt buộc: parse request → validate → authentication/authorization → service → repository →
response. Route Handler không chứa Prisma query hoặc business policy lớn.

## Tasks

### P05-T01 — API response standard

Status: DONE

#### Acceptance Criteria

- [x] Có helper success dùng chung với `success`, `data`, optional `message` và optional `meta`.
- [x] List response có `page`, `pageSize`, `total`, `totalPages`.
- [x] Resource API không tự tạo response shape riêng.
- [x] API response không cache nhầm bằng `Cache-Control: no-store` trong baseline private API.

#### Implementation

- `src/lib/api/response.ts`: `apiSuccess()` và `apiError()`.
- `src/server/api/route.ts`: adapter `apiList()` cho list response.
- Auth route responses đã được đưa về cùng success/error contract.

### P05-T02 — Error response standard

Status: DONE

#### Acceptance Criteria

- [x] Central mapping phân biệt `400`, `401`, `403`, `404`, `409`, `422`, `429`, `500`, `503` theo error code.
- [x] Validation có `VALIDATION_ERROR` và field-level `errors` khi phù hợp.
- [x] Mọi error response có `traceId`, `timestamp`, `path`.
- [x] Unknown error không leak stack, SQL, secret, token, credential hoặc internal path.

#### Implementation

- `src/lib/api/errors.ts`: `ApplicationError`, `ERROR_CODES`, `toApiErrorResponse()`.
- `src/server/api/route.ts`: JSON parse/Zod/unknown error adapters.
- Header `X-Trace-Id` đồng bộ với `traceId` trong body.

### P05-T03 — Product API

Status: DONE

#### Acceptance Criteria

- [x] List/detail/create/update/archive chạy qua permission gate.
- [x] Validate product `name`, `slug`, `price`, `currency`, `status`, `visibility` ở backend.
- [x] Duplicate slug map thành `409 CONFLICT`; resource không tồn tại map thành `404 NOT_FOUND`.
- [x] Price/Decimal và DateTime được map thành JSON-safe DTO.

#### Verification

- [x] API route tests cover response, validation, CRUD/archive và not-found.
- [x] Runtime smoke cover create, duplicate, detail, update, archive, not-found và invalid query.

### P05-T04 — User API

Status: DONE

#### Acceptance Criteria

- [x] List/detail/create/update/status/role assignment/delete được triển khai.
- [x] Password được hash ở service; response/public select không chứa `password` hoặc `passwordHash`.
- [x] Role codes được resolve trong transaction; role không tồn tại trả `404`.
- [x] User self role reassignment và self delete bị chặn; soft-delete revoke active sessions.

#### Verification

- [x] API route tests cover user list/create/detail/update/delete.
- [x] Runtime smoke cover user CRUD/status path và non-exposure.

### P05-T05 — Role API

Status: DONE

#### Acceptance Criteria

- [x] Role list/detail/create/update/delete được triển khai.
- [x] Permission assignment dùng transaction và resolve từ database.
- [x] Duplicate code map thành `409`; permission code không tồn tại map thành `404`.
- [x] System role `ADMIN`/`USER` không đổi code hoặc bị xóa qua API.

#### Verification

- [x] API route tests cover role CRUD và permission assignment payload.
- [x] Runtime smoke cover role list/create/detail/update/delete.

### P05-T06 — Permission API

Status: DONE

#### Acceptance Criteria

- [x] Permission list/detail được triển khai dưới `/api/v1/permissions`.
- [x] Permission list dùng database catalog, có search/pagination/sort whitelist.
- [x] Response chỉ trả public permission fields.

#### Verification

- [x] API route tests cover list/detail và metadata.
- [x] Runtime smoke cover permission list/detail.

### P05-T07 — Pagination

Status: DONE

#### Acceptance Criteria

- [x] Query `page` là integer ≥ 1, mặc định `1`.
- [x] Query `pageSize` là integer 1–100, mặc định `20`.
- [x] Repository dùng `skip/take`; tổng record được trả trong `meta`.
- [x] Invalid pagination trả `422`, không đưa input thô vào query.

#### Verification

- [x] Route tests assert query forwarding và list metadata.
- [x] Runtime smoke assert `pageSize` và list response trên database thực.

### P05-T08 — Sorting

Status: DONE

#### Acceptance Criteria

- [x] `sortOrder` chỉ nhận `asc` hoặc `desc`, mặc định `desc`.
- [x] Product/User/Role/Permission có whitelist `sortBy` riêng.
- [x] Sort input được parse thành object orderBy an toàn trước repository.
- [x] Unknown sort field trả `422`.

#### Verification

- [x] Route tests cover valid sorting and invalid `rawSql` sort field.
- [x] Runtime smoke cover name/email/code sorting requests.

### P05-T09 — Filtering

Status: DONE

#### Acceptance Criteria

- [x] `search` được trim và giới hạn 100 ký tự.
- [x] Product filter whitelist `status`/`visibility`; User filter whitelist `status`.
- [x] Role/Permission hỗ trợ search theo field được phép.
- [x] Filter không bypass soft-delete condition.

#### Verification

- [x] Route tests cover search/status forwarding.
- [x] Runtime smoke cover Product search/status và Role/Permission search.

### P05-T10 — API testing

Status: DONE

#### Acceptance Criteria

- [x] Có route tests cho Product/User/Role/Permission và response/error helper.
- [x] Có test validation, not-found, conflict, 401/403 và secret non-exposure.
- [x] Quality gates pass sau implementation.
- [x] Runtime smoke được chạy trên production Next server với MySQL 8 và Redis.

#### Verification evidence

- [x] `pnpm format:check` — PASS.
- [x] `pnpm lint` — PASS.
- [x] `pnpm typecheck` — PASS.
- [x] `pnpm test` — PASS (`7` test files, `25` tests).
- [x] `pnpm build` — PASS; Next build nhận đủ auth/Product/User/Role/Permission routes.
- [x] `prisma migrate deploy` và `prisma db seed` — PASS trên MySQL 8 container tạm.
- [x] Runtime smoke — PASS với HTTP `200/201/401/403/404/409/422` đúng contract, sau đó đã dừng và
      xóa container/server/temp datadir.

## Files chính

- `src/lib/api/errors.ts`, `src/lib/api/response.ts`, `src/lib/api/query.ts`
- `src/lib/validation/zod.ts`
- `src/server/api/route.ts`, `src/server/api/schemas.ts`
- `src/server/repositories/{product,user,role,permission}.repository.ts`
- `src/server/services/{product,user,role,permission}.service.ts`
- `src/app/api/v1/{products,users,roles,permissions}/`
- `tests/api/routes.test.ts`, `tests/api/response.test.ts`

## Residual assumptions/open items

- Product schema, public visibility, publish workflow, locale/media/inventory vẫn là provisional; cần
  product-owner sign-off trước public SEO launch.
- Master prompt chưa định nghĩa encoding của query key generic `filter`; P05 đã implement typed,
  whitelist filters theo resource và giữ generic filter cho decision riêng trước khi client cần filter
  động.
- Role matrix chi tiết, system-role lifecycle và audit log chưa có business/compliance sign-off.
- Permission create/update/delete chưa expose vì master P05 chỉ yêu cầu Permission list/detail; nếu cần
  quản trị catalog permission phải mở requirement và permission policy riêng.
- API E2E với browser/dashboard, Docker/CI và formal security/performance review thuộc các phase sau.
- `.env` hiện vẫn là placeholder; runtime evidence dùng credentials chỉ trong container tạm, không cập nhật
  secret vào repository.

## Phase verification

- P05-T01 verification: **PASS**.
- P05-T02 verification: **PASS**.
- P05-T03 verification: **PASS**.
- P05-T04 verification: **PASS**.
- P05-T05 verification: **PASS**.
- P05-T06 verification: **PASS**.
- P05-T07 verification: **PASS**.
- P05-T08 verification: **PASS**.
- P05-T09 verification: **PASS**.
- P05-T10 verification: **PASS**.
- Remaining P05 tasks: **NONE**.
- Phase status: **DONE**.
