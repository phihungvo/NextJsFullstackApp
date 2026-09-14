# TIẾN ĐỘ DỰ ÁN

## Tổng quan

- **Project:** Chưa chốt tên chính thức; master prompt vẫn dùng `[PROJECT_NAME]`.
- **Ngày cập nhật:** 2026-09-14.
- **Phase hiện tại:** P08 — Testing (**TODO**, phase kế tiếp).
- **Phase vừa hoàn tất:** P07 — SEO (**DONE**, P07-T01..P07-T07 đã auto-approved theo yêu cầu).
- **P00:** 10 DONE.
- **P01:** 10 DONE.
- **P02:** 10 DONE.
- **P03:** 8 DONE, 1 skipped có chủ đích (`P03-T06`, refresh token), 0 TODO.
- **P04:** 8 DONE.
- **P05:** 10 DONE.
- **P06:** 16 DONE, 0 TODO, 0 blocked.
- **P07:** 7 DONE, technical SEO baseline hoàn tất; public taxonomy vẫn chờ product sign-off.
- **P10:** 9 DONE, completed out-of-order theo yêu cầu Docker.

## Phase status

| Phase | Tên                            | Trạng thái | Ghi chú                                                            |
| ----- | ------------------------------ | ---------- | ------------------------------------------------------------------ |
| P00   | Discovery & Project Definition | DONE       | Docs-only; product decisions còn provisional                       |
| P01   | Foundation                     | DONE       | Foundation quality gates đã pass                                   |
| P02   | Database                       | DONE       | Provisional schema, migration và seed đã verify                    |
| P03   | Authentication                 | DONE       | Web-only opaque session; refresh token skipped có chủ đích         |
| P04   | Authorization                  | DONE       | RBAC/permission baseline và backend tests đã pass                  |
| P05   | Backend API                    | DONE       | API contract, CRUD, validation, pagination/sort/filter đã pass     |
| P06   | Frontend                       | DONE       | Tất cả 16 task đã implement, verify và AUTO-APPROVED               |
| P07   | SEO                            | DONE       | Technical SEO baseline; public taxonomy vẫn provisional            |
| P08   | Testing                        | TODO       | Component/E2E/regression mở rộng theo scope                        |
| P09   | Security                       | TODO       | Formal security audit                                              |
| P10   | Docker                         | DONE       | Dev/production Compose, standalone image, migration và healthcheck |
| P11   | CI/CD                          | TODO       | Pipeline quality gates                                             |
| P12   | Final Review                   | TODO       | Chỉ DONE khi toàn bộ acceptance đạt                                |

## P06 — Frontend đã hoàn tất

- P06-T01 — Global layout.
- P06-T02 — Public layout.
- P06-T03 — Auth layout.
- P06-T04 — Dashboard layout.
- P06-T05 — Login page.
- P06-T06 — Dashboard.
- P06-T07 — Product list.
- P06-T08 — Product create.
- P06-T09 — Product update.
- P06-T10 — Product detail.
- P06-T11 — User management.
- P06-T12 — Role management.
- P06-T13 — Permission management.
- P06-T14 — Loading states.
- P06-T15 — Error states.
- P06-T16 — Responsive.

Chi tiết implementation/acceptance: `docs/tasks/PHASE-06-FRONTEND.md`.

P10 cũng đã hoàn tất out-of-order: xem `docs/tasks/PHASE-10-DOCKER.md` và
`docs/09_DOCKER_DEPLOYMENT.md`.

P07 cũng đã hoàn tất technical baseline: xem `docs/tasks/PHASE-07-SEO.md`.

## P07 verification

Đã chạy bằng binaries local trong `node_modules/.bin` vì shell hiện không có command `pnpm`:

- Prettier check: **PASS**.
- ESLint: **PASS**.
- TypeScript `tsc --noEmit`: **PASS**.
- Vitest: **PASS** — 8 test files, 28 tests.
- Next production build: **PASS** — 19 routes generated, gồm `/robots.txt` và `/sitemap.xml`.
- Runtime SEO smoke: **PASS** — public canonical/OG/Twitter/JSON-LD, sitemap/robots và private noindex.

Route baseline đã có: `/`, `/login`, `/dashboard`, `/dashboard/products`, Product create/update/detail,
`/dashboard/users`, `/dashboard/roles`, `/dashboard/permissions`, `/robots.txt`, `/sitemap.xml`.

## Các phase trước

P00–P05 vẫn giữ các quyết định và evidence đã ghi trong task registers tương ứng. P03-T06 refresh token
tiếp tục là **SKIPPED có chủ đích** cho web-only MVP; chỉ mở lại khi có external client hoặc requirement
long-lived session.

## Tasks bị blocked / open questions

Các product decisions sau vẫn **OPEN/BLOCKING cho product launch**, không phải lỗi verification của P06:

1. Product name, audience, proposition và public information architecture.
2. Product field/status/visibility business sign-off.
3. Role matrix chi tiết, system-role lifecycle và authorization audit log.
4. Session retention/cleanup, hosting, traffic, SLO, compliance và backup policy.

P06 chỉ auto-approve implementation/technical baseline theo yêu cầu người dùng; không biến các open
questions thành business sign-off ngầm.

## Quyết định kỹ thuật hiện tại

- Next.js Fullstack + App Router, Server Component mặc định.
- Route groups `(public)`, `(auth)`, `(dashboard)` trong cùng một application.
- MySQL 8 + Prisma, Redis cho rate limiting/session-related needs.
- Cookie-first authentication, opaque DB-backed session 8 giờ, HMAC token hash.
- Backend authorization là security boundary; frontend `can()` chỉ hỗ trợ UX.
- API P05 dùng response/error helper tập trung, Zod server validation, repository/service boundary,
  whitelist query và soft-delete.
- P06 dùng semantic HTML, native form controls và CSS primitives hiện có của repo; không thêm dependency
  UI chưa có trong workspace trong phase này. Việc thay thế bằng Ant Design/TanStack Query/React Hook Form
  là một technical choice riêng nếu product owner yêu cầu khóa UI stack theo target architecture.

## Việc tiếp theo

**P08-T01 — Component/E2E test scope**

Mở rộng test strategy từ Vitest route/unit hiện tại sang component, browser và regression coverage theo
public/private route boundary.

## Project status note

P00–P07 đã có discovery, foundation, database, authentication, authorization, backend API, frontend baseline
và technical SEO; P10 Docker đã hoàn tất out-of-order với verification thực tế trên Docker Desktop. Project
vẫn chưa production-ready vì product sign-off, P08 testing expansion, P09 formal security, P11 CI/CD và P12
final review còn lại.
