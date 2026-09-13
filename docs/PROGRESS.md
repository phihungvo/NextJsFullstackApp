# TIẾN ĐỘ DỰ ÁN

## Tổng quan

- **Project:** Chưa chốt tên; master prompt đang dùng `[PROJECT_NAME]`.
- **Ngày cập nhật:** 2026-09-13.
- **Phase hiện tại:** P03 — Authentication (**TODO**, task kế tiếp).
- **Task hiện tại:** P03-T01 — Authentication architecture (**TODO**, chờ session decision).
- **Phase vừa hoàn tất:** P02 — Database.
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

## Phase

| Phase | Tên                            | Trạng thái | Ghi chú                                                  |
| ----- | ------------------------------ | ---------- | -------------------------------------------------------- |
| P00   | Discovery & Project Definition | DONE       | Docs-only; không có application code để test             |
| P01   | Foundation                     | DONE       | P01-T01..P01-T10 đã xong; foundation gates đã pass       |
| P02   | Database                       | DONE       | P02-T01..P02-T10 đã xong; provisional schema đã verify   |
| P03   | Authentication                 | TODO       | Phụ thuộc P02 hoặc session decision phù hợp              |
| P04   | Authorization                  | TODO       | Phụ thuộc P03 và role matrix                             |
| P05   | Backend API                    | TODO       | Phụ thuộc P04                                            |
| P06   | Frontend                       | TODO       | Phụ thuộc P05                                            |
| P07   | SEO                            | TODO       | Có thể song song một phần với P06 sau public IA decision |
| P08   | Testing                        | TODO       | Theo scope implementation                                |
| P09   | Security                       | TODO       | Review xuyên suốt, formal audit ở phase này              |
| P10   | Docker                         | TODO       | Phụ thuộc application foundation                         |
| P11   | CI/CD                          | TODO       | Phụ thuộc scripts/build và deployment decision           |
| P12   | Final Review                   | TODO       | Chỉ DONE khi toàn bộ acceptance đạt                      |

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
- Task tiếp theo: **P03-T01 — Authentication architecture**, chờ session strategy decision.
- Các open questions về product vẫn được giữ nguyên; P02 chỉ encode provisional baseline, chưa được coi là business sign-off.

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

Chi tiết acceptance/verification: `docs/tasks/PHASE-01-FOUNDATION.md` và `docs/tasks/PHASE-02-DATABASE.md`.

## Tasks đang thực hiện

- Không có task đang chạy tại thời điểm cập nhật; P03-T01 là task kế tiếp ở trạng thái TODO.

## Tasks bị Blocked

- Có các product decision chưa xác nhận, được ghi là **OPEN/BLOCKING** trong hai tài liệu discovery; đây là dependency cần xử lý, không được biến thành DONE bằng assumption im lặng.

## Quyết định kỹ thuật

- Next.js Fullstack + App Router, không có Spring Boot/backend Java riêng.
- Modular Monolith; feature-based modules và service/repository separation.
- Server Component mặc định; public SEO pages server-rendered; private dashboard `noindex`.
- MySQL 8 + Prisma; Redis cho cache/rate limiting/session-related data phù hợp.
- Ant Design, TanStack Query, React Hook Form, Zod, Vitest, Testing Library, Playwright.
- pnpm là package manager target.
- Authentication cookie-first; session model cụ thể cần quyết định ở P03.
- Product catalog + User/Role/Permission là MVP foundation, nhưng business meaning/product proposition còn provisional.

## Vấn đề đang tồn tại

1. Chưa có business brief, product name, audience sign-off hoặc public information architecture.
2. Chưa có tests, Docker hoặc CI; database schema/migration/seed đã được triển khai theo provisional baseline và verify trên MySQL local.
3. Chưa có role matrix mở rộng, Product business sign-off hoặc session strategy.
4. Workspace chưa phải Git repository hợp lệ.
5. `docs/AI_MASTER_PROMPT.md` kết thúc bằng câu chưa hoàn chỉnh; cần maintenance task riêng, không tự sửa trong Phase 00.
6. Master prompt có discrepancy giữa `docs/15_PROGRESS.md` và `docs/PROGRESS.md`; hiện dùng `docs/PROGRESS.md` theo workflow chi tiết và `AI_START_PROMPT.md`.

## Việc tiếp theo

**P03-T01 — Authentication architecture**

Phạm vi dự kiến: chốt session strategy, cookie policy, password hashing integration, logout/revoke
và rate limiting trước khi triển khai authentication flow. Product/schema thay đổi sau sign-off phải
dùng migration mới.

## Phase 00 completion note

P00 đã hoàn tất discovery/documentation, P01 đã hoàn tất foundation và P02 đã hoàn tất database theo
provisional baseline. Runtime đã verify trên MySQL 9.3 local; target production vẫn là MySQL 8. Test
runner chưa được cài vì thuộc P08. Project vẫn chưa production-ready và P03 còn phụ thuộc session
strategy decision.
