# PHASE 02 — DATABASE

## Mục tiêu

Thiết lập Prisma/MySQL 8 và xây dựng schema có migration, seed, relationship, constraint và index
dựa trên product requirements đã được xác nhận.

## Dependencies

- P01 — Foundation: DONE.
- `DATABASE_URL` contract: đã có trong `.env.example`.
- Product schema/status/visibility, role matrix và session strategy: đã ghi baseline provisional để
  unblock P02; business sign-off cuối cùng vẫn cần trước production/public launch.

## Tasks

### P02-T01 — Thiết lập Prisma

Status: DONE

#### Subtasks

- [x] P02-T01-S01 — Cài Prisma CLI, Prisma Client và MySQL adapter cùng version `7.10.0`.
- [x] P02-T01-S02 — Tạo `prisma.config.ts`, `prisma/schema.prisma` và generated client output.
- [x] P02-T01-S03 — Tạo server-only Prisma singleton boundary.
- [x] P02-T01-S04 — Thêm scripts `postinstall`, `db:generate`, `db:validate`, `db:migrate`, `db:deploy` và `db:seed`.

#### Acceptance Criteria

- [x] Prisma CLI và Prisma Client cùng version, provider là MySQL.
- [x] Prisma schema/config validate được và không hardcode credential.
- [x] Database client không thể bị import vào Client Component theo server-only boundary.
- [x] Domain model/migration/seed được tạo theo provisional baseline đã ghi trong tài liệu; không coi đây là business sign-off cuối cùng.

#### Verification

- [x] `prisma --version` — PASS (`7.10.0`, Node `v22.15.0`).
- [x] `prisma validate` — PASS.
- [x] `prisma generate` — PASS.
- [x] `pnpm format:check`.
- [x] `pnpm lint`.
- [x] `pnpm typecheck`.
- [x] `pnpm build`.

#### Notes

Prisma 7 dùng `prisma-client` generator với output explicit vào `src/generated/prisma`; thư mục
generated bị ignore và được tạo lại bởi `postinstall`/`db:generate`.

### P02-T02 — Thiết kế User

Status: DONE — provisional baseline.

#### Subtasks

- [x] P02-T02-S01 — Xác định identity, credential hash, display name và lifecycle status.
- [x] P02-T02-S02 — Thêm unique email, timestamps, soft-delete field và status index.

#### Acceptance Criteria

- [x] User có `id`, `email`, `passwordHash`, `name`, `status`, timestamps và `deletedAt`.
- [x] Email unique; password chỉ lưu dạng hash, không seed plaintext vào database.

#### Verification

- [x] Schema/migration review.
- [x] Seed tạo 2 users với Argon2id hash.

### P02-T03 — Thiết kế Role

Status: DONE — provisional baseline.

#### Acceptance Criteria

- [x] Role có `id`, `name`, unique `code`, `description`, `createdAt` và `updatedAt`.
- [x] Baseline seed có `ADMIN` và `USER` role.

#### Verification

- [x] Schema/migration review và seed count verification.

### P02-T04 — Thiết kế Permission

Status: DONE — provisional baseline.

#### Acceptance Criteria

- [x] Permission có `id`, `name`, unique `code`, `description`, `createdAt` và `updatedAt`.
- [x] Permission code mở rộng được và seed có CRUD permissions cho Product/User/Role/Permission.

#### Verification

- [x] Seed tạo 16 permission codes và code uniqueness được enforce bởi database.

### P02-T05 — Thiết kế Product

Status: DONE — provisional baseline.

#### Acceptance Criteria

- [x] Product có `name`, unique `slug`, `description`, `price`, `currency`, `status`, `visibility`, timestamps và `deletedAt`.
- [x] Status gồm `DRAFT`, `PUBLISHED`, `ARCHIVED`; visibility gồm `PRIVATE`, `PUBLIC`.
- [x] Price dùng `DECIMAL(12,2)`; currency dùng `CHAR(3)` với default provisional `USD`.

#### Verification

- [x] Schema/migration review và 2 sample products được seed.

### P02-T06 — Thiết kế relationships

Status: DONE

#### Acceptance Criteria

- [x] User–Role và Role–Permission dùng explicit join tables với composite primary key.
- [x] Join tables có foreign key, cascade behavior và reverse lookup index.

#### Verification

- [x] MySQL runtime verification: 4 foreign keys tồn tại.

### P02-T07 — Index

Status: DONE

#### Acceptance Criteria

- [x] Unique index cho User email, Role code, Permission code và Product slug.
- [x] Composite index phục vụ status/list filtering và reverse join lookup.
- [x] Không thêm index cho full-text search khi query strategy chưa được chốt.

#### Verification

- [x] Migration/index review; MySQL runtime ghi nhận 13 secondary index entries.

### P02-T08 — Migration

Status: DONE

#### Acceptance Criteria

- [x] Có initial migration từ empty schema và migration lock cho MySQL.
- [x] Migration không chứa credential hoặc data seed.

#### Verification

- [x] Generated SQL diff khớp `migration.sql`.
- [x] `prisma migrate deploy`/`db:deploy` — PASS.
- [x] `prisma migrate status` — database schema up to date.

### P02-T09 — Seed

Status: DONE — development only.

#### Acceptance Criteria

- [x] Seed có Admin/User role, permissions, Admin/Normal User và sample products.
- [x] Password lấy từ `SEED_ADMIN_PASSWORD`/`SEED_USER_PASSWORD` (tối thiểu 12 ký tự) và hash bằng Argon2id.
- [x] Seed từ chối `NODE_ENV=production` và không ghi password vào output.
- [x] Seed dùng upsert để chạy lặp lại an toàn.

#### Verification

- [x] Seed lần đầu và lần hai — PASS/idempotent.
- [x] Runtime count verification: 2 users, 2 roles, 16 permissions, 2 user roles, 17 role permissions, 2 products.
- [x] 2/2 user password hashes có Argon2id prefix.

### P02-T10 — Database verification

Status: DONE

#### Acceptance Criteria

- [x] Schema validate/generate, migration deploy, seed và status verification đều có command reproducible.
- [x] Runtime verification không phụ thuộc database production/shared.

#### Verification

- [x] MySQL temporary datadir runtime verification — PASS.
- [x] `prisma validate`, `prisma generate`, `prisma migrate deploy`, `prisma migrate status` — PASS.
- [x] Runtime smoke chạy trên MySQL 9.3 local; target MySQL 8 vẫn cần verify trong deployment environment.
- [x] Temporary MySQL instance đã được dừng và datadir đã dọn.

## Provisional schema decisions

| Area               | Baseline P02                                            | Caveat                                            |
| ------------------ | ------------------------------------------------------- | ------------------------------------------------- |
| User lifecycle     | `ACTIVE`, `INACTIVE`, `SUSPENDED`; soft delete field    | Auth/session policy vẫn cần chốt ở P03            |
| Product lifecycle  | `DRAFT`, `PUBLISHED`, `ARCHIVED`                        | Publish transition và audit policy chưa chốt      |
| Product visibility | `PRIVATE`, `PUBLIC`                                     | Public IA/SEO behavior cần chốt ở P07             |
| Monetary value     | `DECIMAL(12,2)` + `CHAR(3)`, default `USD`              | Currency/locale business sign-off còn mở          |
| Scope              | Không thêm media, inventory, tenant, audit/event tables | Chỉ mở rộng bằng migration mới khi có requirement |

## Phase verification

- P02-T01 verification: **PASS**.
- P02-T02 verification: **PASS**.
- P02-T03 verification: **PASS**.
- P02-T04 verification: **PASS**.
- P02-T05 verification: **PASS**.
- P02-T06 verification: **PASS**.
- P02-T07 verification: **PASS**.
- P02-T08 verification: **PASS**.
- P02-T09 verification: **PASS**.
- P02-T10 verification: **PASS**.
- Remaining P02 tasks: **NONE**.
- Phase status: **DONE**.

## Residual decisions after provisional schema

- Product owner sign-off cho field/currency/locale và product lifecycle.
- Role/permission expansion ngoài baseline seed.
- Session persistence model và related tables ở P03.
- Development seed account rotation/retention policy.
- Thay đổi sau sign-off phải tạo migration mới, không sửa initial migration đã chạy.
