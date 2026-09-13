# PHASE 06 — FRONTEND

## Mục tiêu

Hoàn thiện frontend foundation trên App Router và API contract P05: public/auth/dashboard route
boundaries, product workflow, user/role/permission screens, trạng thái UX, permission-aware actions,
responsive và accessibility baseline.

Product proposition, public IA chi tiết và role matrix business vẫn là provisional theo discovery. Việc
"auto approved" trong register này là approval cho implementation/technical baseline theo yêu cầu của
user; không thay thế product-owner sign-off cho các open questions đó.

## Quyết định triển khai

- `src/app/layout.tsx` là global layout; route groups `(public)`, `(auth)` và `(dashboard)` giữ boundary
  rõ ràng mà không làm thay đổi URL.
- Server Component là mặc định. Client Component chỉ dùng ở form, fetch state, event handler,
  authentication context và responsive menu.
- Dashboard dùng cookie session qua `/api/v1/auth/me`; client không nhận Prisma, database URL, Redis URL,
  `AUTH_SECRET` hoặc raw session token.
- `can()` chỉ điều khiển navigation/action visibility cho UX. API P05 vẫn là security boundary và trả
  `401/403` độc lập.
- Permission catalog là read-only ở UI, đúng với P05 hiện chỉ expose list/detail; create/update/delete
  permission không tự mở rộng ngoài requirement.

## Task register

| Task    | Phạm vi đã triển khai                                                    | Trạng thái | Approval      |
| ------- | ------------------------------------------------------------------------ | ---------- | ------------- |
| P06-T01 | Global metadata, `lang="vi"`, skip link, global CSS và shared primitives | DONE       | AUTO-APPROVED |
| P06-T02 | Public header/footer, landing page và public CTA                         | DONE       | AUTO-APPROVED |
| P06-T03 | Auth layout, noindex metadata và auth shell                              | DONE       | AUTO-APPROVED |
| P06-T04 | Dashboard layout, session provider, sidebar/topbar, noindex              | DONE       | AUTO-APPROVED |
| P06-T05 | Login form, loading/submit/error, safe `next` redirect                   | DONE       | AUTO-APPROVED |
| P06-T06 | Dashboard overview, metrics và recent products                           | DONE       | AUTO-APPROVED |
| P06-T07 | Product list, search, pagination, empty/error/permission actions         | DONE       | AUTO-APPROVED |
| P06-T08 | Product create form và server validation feedback                        | DONE       | AUTO-APPROVED |
| P06-T09 | Product update form và permission/not-found handling                     | DONE       | AUTO-APPROVED |
| P06-T10 | Product detail, metadata, archive và 401/403/404 states                  | DONE       | AUTO-APPROVED |
| P06-T11 | User list, create/update/status/role assignment và soft-delete action    | DONE       | AUTO-APPROVED |
| P06-T12 | Role list, create/update/delete và permission assignment                 | DONE       | AUTO-APPROVED |
| P06-T13 | Permission catalog list/search/read-only management screen               | DONE       | AUTO-APPROVED |
| P06-T14 | Shared loading state, route loading và mutation disabled states          | DONE       | AUTO-APPROVED |
| P06-T15 | Shared error/empty/unauthorized/forbidden/not-found states và retry      | DONE       | AUTO-APPROVED |
| P06-T16 | Responsive sidebar, tables, forms, mobile menu, keyboard/focus baseline  | DONE       | AUTO-APPROVED |

## Acceptance checklist

- [x] Code hoàn thành cho P06-T01..P06-T16.
- [x] Route groups không tạo URL dư: `/`, `/login`, `/dashboard`, `/dashboard/products`,
      `/dashboard/products/new`, `/dashboard/products/[id]`, `/dashboard/products/[id]/edit`,
      `/dashboard/users`, `/dashboard/roles`, `/dashboard/permissions`.
- [x] TypeScript strict: `tsc --noEmit` pass.
- [x] ESLint pass.
- [x] Prettier check pass.
- [x] Existing Vitest suite pass: 7 files, 25 tests.
- [x] Production build pass và nhận đủ route App Router.
- [x] Không đưa server secret/Prisma vào client UI; API vẫn enforce authentication/authorization.
- [x] Documentation và task/progress register đã cập nhật.
- [x] Approval implementation được ghi nhận là `AUTO-APPROVED` theo yêu cầu người dùng.

## Verification evidence

Đã chạy trong workspace bằng local binaries có sẵn trong `node_modules/.bin` vì shell hiện không có
command `pnpm`:

```text
prettier . --check       PASS
eslint .                 PASS
tsc --noEmit             PASS
vitest run               PASS — 7 files, 25 tests
next build               PASS — 17 routes generated
```

## Files chính

- `src/app/layout.tsx`, `src/app/globals.css`
- `src/app/(public)/`, `src/app/(auth)/`, `src/app/(dashboard)/`
- `src/components/ui/states.tsx`
- `src/features/auth/`, `src/features/dashboard/`
- `src/features/products/`, `src/features/users/`, `src/features/roles/`, `src/features/permissions/`
- `src/lib/api/client.ts`, `src/lib/api/types.ts`

## Residual scope

P06 không tự chốt product name, public content taxonomy, product business sign-off, role matrix chi tiết,
SEO metadata/sitemap/robots, component/E2E test framework, Docker, CI/CD hoặc formal security/performance
review. Các nội dung đó tiếp tục ở P07–P12 theo master prompt.
