# TIẾN ĐỘ DỰ ÁN

## Tổng quan

- **Project:** Chưa chốt tên; master prompt đang dùng `[PROJECT_NAME]`.
- **Ngày cập nhật:** 2026-09-14.
- **Phase hiện tại:** P05 — Backend API (**TODO**, task kế tiếp).
- **Task hiện tại:** P05-T01 — API response standard (**TODO**, phụ thuộc authorization đã hoàn tất).
- **Phase vừa hoàn tất:** P04 — Authorization.
- **Tổng task Phase 00:** 10.
- **P00 hoàn thành:** 10.
- **P00 đang làm:** 0.
- **P00 blocked:** 0.
- **P00 TODO:** 0.
- **P01 hoàn thành:** 10.
- **P01 đang làm:** 0.
- **P01 blocked:** 0.
- **P01 TODO:** 0.
- **P02 hoàn thành:** 10.
- **P02 đang làm:** 0.
- **P02 blocked:** 0.
- **P02 TODO:** 0.
- **P03 hoàn thành:** 8.
- **P03 đang làm:** 0.
- **P03 blocked:** 0.
- **P03 skipped có chủ đích:** 1 (`P03-T06`, refresh token).
- **P03 TODO:** 0.
- **P04 hoàn thành:** 8.
- **P04 đang làm:** 0.
- **P04 blocked:** 0.
- **P04 TODO:** 0.

## Phase

| Phase | Tên                            | Trạng thái | Ghi chú                                                    |
| ----- | ------------------------------ | ---------- | ---------------------------------------------------------- |
| P00   | Discovery & Project Definition | DONE       | Docs-only; không có application code để test               |
| P01   | Foundation                     | DONE       | P01-T01..P01-T10 đã xong; foundation gates đã pass         |
| P02   | Database                       | DONE       | P02-T01..P02-T10 đã xong; provisional schema đã verify     |
| P03   | Authentication                 | DONE       | P03-T01..P03-T09 đã xong; P03-T06 skipped có chủ đích      |
| P04   | Authorization                  | DONE       | P04-T01..P04-T08 đã xong; baseline role matrix provisional |
| P05   | Backend API                    | TODO       | Phụ thuộc P04                                              |
| P06   | Frontend                       | TODO       | Phụ thuộc P05                                              |
| P07   | SEO                            | TODO       | Có thể song song một phần với P06 sau public IA decision   |
| P08   | Testing                        | TODO       | Theo scope implementation                                  |
| P09   | Security                       | TODO       | Review xuyên suốt, formal audit ở phase này                |
| P10   | Docker                         | TODO       | Phụ thuộc application foundation                           |
| P11   | CI/CD                          | TODO       | Phụ thuộc scripts/build và deployment decision             |
| P12   | Final Review                   | TODO       | Chỉ DONE khi toàn bộ acceptance đạt                        |

## Task đang thực hiện

- Không có task P00 đang thực hiện.
- P01-T01 — Chuẩn hóa project đã hoàn thành.
- P01-T02 — TypeScript strict đã hoàn thành.
- P01-T03 — ESLint đã hoàn thành.
- P01-T04 — Prettier đã hoàn thành.
- P01-T05 — Folder structure đã hoàn thành.
- P01-T06 — Environment configuration đã hoàn thành.
- P01-T07 — Shared utilities đã hoàn thành.
- P01-T08 — Error handling foundation đã hoàn thành.
- P01-T09 — Logging foundation đã hoàn thành.
- P01-T10 — Health check đã hoàn thành.
- P02-T01 — Thiết lập Prisma đã hoàn thành.
- P02-T01..P02-T10 — Database đã hoàn thành theo provisional schema baseline.
- P03-T01..P03-T05 — Authentication architecture, password, login, logout, session đã hoàn thành.
- P03-T06 — Refresh token đã **SKIPPED có chủ đích** cho web-only MVP; xem task register Phase 03.
- P03-T07..P03-T09 — Me endpoint, rate limiting và authentication tests đã hoàn thành.
- P04-T01..P04-T08 — RBAC, permission model, auth guards, frontend helper, 403 handling và tests đã hoàn thành.
- Task tiếp theo: **P05-T01 — API response standard**.
- Các open questions về product vẫn được giữ nguyên; P02/P03/P04 chỉ encode provisional baseline, chưa được coi là business sign-off.

## Tasks đã hoàn thành

- P00-T01 — Kiểm tra cấu trúc repository.
- P00-T02 — Kiểm tra `package.json`.
- P00-T03 — Kiểm tra Next.js version.
- P00-T04 — Kiểm tra TypeScript configuration.
- P00-T05 — Kiểm tra database configuration.
- P00-T06 — Kiểm tra environment.
- P00-T07 — Kiểm tra existing features.
- P00-T08 — Kiểm tra architecture hiện tại.
- P00-T09 — Xác định technical debt.
- P00-T10 — Đề xuất implementation plan.
- P01-T01 — Chuẩn hóa project.
- P01-T02 — TypeScript strict.
- P01-T03 — ESLint.
- P01-T04 — Prettier.
- P01-T05 — Folder structure.
- P01-T06 — Environment configuration.
- P01-T07 — Shared utilities.
- P01-T08 — Error handling foundation.
- P01-T09 — Logging foundation.
- P01-T10 — Health check.
- P02-T01 — Thiết lập Prisma.
- P02-T02 — Thiết kế User.
- P02-T03 — Thiết kế Role.
- P02-T04 — Thiết kế Permission.
- P02-T05 — Thiết kế Product.
- P02-T06 — Thiết kế relationships.
- P02-T07 — Index.
- P02-T08 — Migration.
- P02-T09 — Seed.
- P02-T10 — Database verification.
- P03-T01 — Authentication architecture.
- P03-T02 — Password hashing.
- P03-T03 — Login.
- P03-T04 — Logout.
- P03-T05 — Session.
- P03-T07 — Me endpoint.
- P03-T08 — Rate limiting.
- P03-T09 — Authentication tests.
- P04-T01 — RBAC.
- P04-T02 — Permission model.
- P04-T03 — requireAuth.
- P04-T04 — requirePermission.
- P04-T05 — Frontend permission helper.
- P04-T06 — Permission middleware/service.
- P04-T07 — 403 handling.
- P04-T08 — Authorization tests.

Task được đánh dấu skip có chủ đích:

- P03-T06 — Refresh token nếu cần: chưa cần cho web-only MVP; phải tạo decision/migration/test mới nếu có external client.

Chi tiết acceptance/verification: `docs/tasks/PHASE-01-FOUNDATION.md`, `docs/tasks/PHASE-02-DATABASE.md`,
`docs/tasks/PHASE-03-AUTHENTICATION.md` và `docs/tasks/PHASE-04-AUTHORIZATION.md`.

## Tasks đang thực hiện

- Không có task đang chạy tại thời điểm cập nhật.
- Task kế tiếp: **P05-T01 — API response standard**.

## Tasks bị Blocked

- Có các product decision chưa xác nhận, được ghi là **OPEN/BLOCKING** trong hai tài liệu discovery; đây là dependency cần xử lý, không được biến thành DONE bằng assumption im lặng.

## Quyết định kỹ thuật

- Next.js Fullstack + App Router, không có Spring Boot/backend Java riêng.
- Modular Monolith; feature-based modules và service/repository separation.
- Server Component mặc định; public SEO pages server-rendered; private dashboard `noindex`.
- MySQL 8 + Prisma; Redis cho cache/rate limiting/session-related data phù hợp.
- Ant Design, TanStack Query, React Hook Form, Zod, Vitest, Testing Library, Playwright.
- pnpm là package manager target.
- Authentication cookie-first; P03 dùng opaque DB-backed session 8 giờ, HMAC token hash, không refresh pair trong web-only MVP.
- Login dùng Argon2id và Redis rate limit 5 attempts/60 giây; Redis failure fail-closed, không fallback in-memory production.
- Product catalog + User/Role/Permission là MVP foundation; P04 dùng Admin full baseline và User `PRODUCT_VIEW`, nhưng business meaning/role matrix còn provisional.

## Vấn đề đang tồn tại

1. Chưa có business brief, product name, audience sign-off hoặc public information architecture.
2. Chưa có product/user/role/permission API hoặc feature UI; Docker và CI cũng chưa có.
3. Role matrix chi tiết, Product business sign-off, session cleanup/retention policy và authorization audit log còn mở.
4. Git remote/commit workflow của repository chưa được xác nhận.
5. `docs/AI_MASTER_PROMPT.md` kết thúc bằng câu chưa hoàn chỉnh; cần maintenance task riêng, không tự sửa trong Phase 00.
6. Master prompt có discrepancy giữa `docs/15_PROGRESS.md` và `docs/PROGRESS.md`; hiện dùng `docs/PROGRESS.md` theo workflow chi tiết và `AI_START_PROMPT.md`.

## Việc tiếp theo

**P05-T01 — API response standard**

Phạm vi dự kiến: chuẩn hóa success/list/error response cho Product/User/Role/Permission API, tái sử dụng
centralized error/trace contract và giữ flow route → validation → auth → authorization → service →
repository. Role matrix chi tiết còn provisional; thay đổi schema sau sign-off phải dùng migration mới.

## Phase 00 completion note

P00 đã hoàn tất discovery/documentation, P01 foundation, P02 database, P03 authentication và P04
authorization theo provisional baseline. P04 đã verify backend authorization tests, frontend helper,
403 mapping và role/permission runtime probe với temporary MySQL; các quality gates vẫn pass. Target
production vẫn là MySQL 8. Project chưa production-ready vì product API/UI, Docker, CI/CD và formal
security review còn ở các phase sau.
