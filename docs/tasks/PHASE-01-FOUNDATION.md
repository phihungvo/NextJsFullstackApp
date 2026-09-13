# PHASE 01 — FOUNDATION

## Mục tiêu

Chuẩn hóa Next.js Fullstack application để có nền tảng TypeScript, tooling, cấu trúc module, environment, shared utilities, lỗi/logging và health-check trước database/auth.

## Dependencies

- P00 — Discovery & Project Definition: DONE.
- `docs/00_PROJECT_OVERVIEW.md` và `docs/01_PRODUCT_REQUIREMENTS.md`: baseline đã review; product proposition vẫn provisional.
- Node.js `v22.15.0` khả dụng; pnpm `12.4.1` được pin bằng `packageManager`.

## Tasks

### P01-T01 — Chuẩn hóa project

Status: DONE

#### Subtasks

- [x] P01-T01-S01 — Tạo package manifest với pnpm và scripts chuẩn.
- [x] P01-T01-S02 — Tạo Next.js App Router + TypeScript skeleton trong `src/`.
- [x] P01-T01-S03 — Thêm ESLint flat config và Prettier config.
- [x] P01-T01-S04 — Thêm `.env.example`, `.gitignore`, README và alias `@/*`.
- [x] P01-T01-S05 — Cài dependency tương thích và tạo `pnpm-lock.yaml`.

#### Acceptance Criteria

- [x] `package.json` dùng pnpm `12.4.1` và không trộn package manager.
- [x] Next.js App Router chạy với TypeScript strict.
- [x] Có scripts `dev`, `build`, `start`, `lint`, `typecheck`, `format` và `format:check`.
- [x] Không thêm database, authentication, authorization hoặc domain feature ở task này.

#### Verification

- [x] `pnpm peers check` — PASS.
- [x] `pnpm format:check` — PASS.
- [x] `pnpm lint` — PASS.
- [x] `pnpm typecheck` — PASS.
- [x] `pnpm build` — PASS.

#### Notes

- CLI `create-next-app` không dùng được trực tiếp vì folder `NextJSFullstackApp` có chữ hoa; folder không bị đổi tên. Foundation được tạo tương đương bằng các file chuẩn của Next.js.
- Package slug kỹ thuật là `nextjs-fullstack-app`; project/brand name vẫn chưa chốt.
- `pnpm-workspace.yaml` chứa policy cho phép build `unrs-resolver`, dependency native cần cho Next.js resolver.
- Test runner và test suite để P08; không tạo script test giả.

### P01-T02 — TypeScript strict

Status: DONE

#### Subtasks

- [x] P01-T02-S01 — Review compiler options và server/client type boundaries.
- [x] P01-T02-S02 — Xác định shared type policy.

#### Acceptance Criteria

- [x] Strict policy được review trên code thực tế.
- [x] Không có `any`/`@ts-ignore` tùy tiện.

#### Verification

- [x] `pnpm typecheck`

#### Notes

Compiler policy hiện bật `strict: true`, `forceConsistentCasingInFileNames`, `noUncheckedIndexedAccess`, `noImplicitOverride` và `noFallthroughCasesInSwitch`. Shared type policy: dùng type gần feature/consumer; chỉ đưa vào `src/types` khi có từ hai consumer trở lên; DTO/API contract không dùng trực tiếp Prisma type; boundary input là `unknown` và phải parse/validate; server-only type/module không được import vào Client Component; không dùng `any`, `as any` hoặc `@ts-ignore` để che lỗi.

Hiện repository chỉ có Server Components, chưa có Client Component hoặc server-only module; boundary review không phát hiện vi phạm.

#### Verification result

- `strict` and compiler guard review: PASS.
- `any`/`@ts-ignore` scan trên application/config: PASS.

### P01-T03 — ESLint

Status: DONE

#### Subtasks

- [x] P01-T03-S01 — Review Next.js flat config và TypeScript rules.
- [x] P01-T03-S02 — Thêm rule cấm explicit `any` và duplicate imports.
- [x] P01-T03-S03 — Thêm boundary rule cho file `*.client.*`.

#### Acceptance Criteria

- [x] ESLint rules/boundaries được review và không có warning không giải quyết.
- [x] Explicit `any` bị báo lỗi.
- [x] Client convention không thể import server-only modules.

#### Verification

- [x] `pnpm lint`

#### Notes

Boundary rule hiện áp dụng cho file có hậu tố `*.client.*`; đây là convention rõ ràng cho Client Components khi module client được tạo. Các file Server Components hiện tại không có import server-only trực tiếp.

### P01-T04 — Prettier

Status: DONE

#### Subtasks

- [x] P01-T04-S01 — Review Prettier options và file scope.
- [x] P01-T04-S02 — Giữ prompt legacy ngoài write/check scope.
- [x] P01-T04-S03 — Thêm `.editorconfig` đồng bộ với formatter.

#### Acceptance Criteria

- [x] Formatting policy được áp dụng thống nhất cho application/config files.
- [x] Prompt legacy không bị rewrite ngoài phạm vi task.
- [x] Editor defaults dùng UTF-8, LF, 2 spaces và final newline.

#### Verification

- [x] `pnpm format:check`

#### Notes

`docs/AI_MASTER_PROMPT.md` và `docs/AI_START_PROMPT.md` được giữ ngoài Prettier scope vì là tài liệu legacy đã có trước foundation; hai file không bị format lại. Các file application/config/docs do project tạo được kiểm tra bằng `prettier . --check`.

### P01-T05 — Folder structure

Status: DONE

#### Subtasks

- [x] P01-T05-S01 — Tạo feature/component/server/lib/config/types boundaries.
- [x] P01-T05-S02 — Ghi trách nhiệm và import policy cho từng boundary.
- [x] P01-T05-S03 — Review không tạo domain implementation hoặc thư mục rỗng không có mục đích.

#### Acceptance Criteria

- [x] Feature/server/lib boundaries được tạo theo overview mà không tạo thư mục rỗng thừa.
- [x] Server/client import boundary được kiểm tra.
- [x] Không có database/auth/domain feature implementation trong task này.

#### Verification

- [x] Structure review
- [x] Server/client import scan
- [x] `pnpm typecheck`

#### Notes

Các boundary hiện được giữ bằng README marker có trách nhiệm cụ thể. Route groups, `prisma/` và
`tests/` sẽ được tạo ở phase tương ứng khi có route/schema/test consumer; không tạo `.gitkeep` hoặc
placeholder code không cần thiết.

### P01-T06 — Environment configuration

Status: DONE

#### Subtasks

- [x] P01-T06-S01 — Xác định environment contract trong `.env.example`.
- [x] P01-T06-S02 — Tạo server-only Zod environment loader.
- [x] P01-T06-S03 — Redact giá trị secret khỏi validation error.
- [x] P01-T06-S04 — Kiểm tra không có environment import vào client code.

#### Acceptance Criteria

- [x] Environment schema/loader có validation server-side.
- [x] Secret không xuất hiện trong client bundle hoặc repository.
- [x] Invalid configuration chỉ báo tên biến/path cần sửa.

#### Verification

- [x] Static environment contract review
- [x] Server/client import scan
- [x] `pnpm build`

#### Notes

`src/config/env.ts` dùng `server-only`, không được import vào Client Component. Runtime config tests sẽ
được thêm khi Vitest được thiết lập ở P08; task này không tạo test runner hoặc test giả.

### P01-T07 — Shared utilities

Status: DONE

#### Subtasks

- [x] P01-T07-S01 — Review các shared library boundary và consumer hiện có.
- [x] P01-T07-S02 — Xác nhận không có utility trùng lặp hoặc nhu cầu runtime chưa được chứng minh.
- [x] P01-T07-S03 — Ghi policy cho `src/lib/utils` để làm boundary cho các phase sau.

#### Acceptance Criteria

- [x] Chỉ thêm shared utility có consumer thực tế.
- [x] Không tạo abstraction trùng lặp.

#### Verification

- [x] Static review import/consumer: không có runtime utility cần thêm.
- [x] Unit tests: N/A — không tạo utility có behavior; test runner thuộc P08.

#### Notes

Không thêm `cn`, formatter, API wrapper hoặc helper dự phòng vì hiện chưa có consumer thực tế. Đây
là kết quả DONE có chủ đích theo policy chống overengineering; `src/lib/utils/README.md` định nghĩa
boundary và nguyên tắc cho utility tương lai.

### P01-T08 — Error handling foundation

Status: DONE

#### Subtasks

- [x] P01-T08-S01 — Định nghĩa error code, HTTP status mapping và API error contract ổn định.
- [x] P01-T08-S02 — Thêm central mapping cho known/unknown errors với `traceId`.
- [x] P01-T08-S03 — Thêm App Router error boundary không render stack trace hoặc chi tiết nội bộ.

#### Acceptance Criteria

- [x] Error boundary/central mapping không expose stack trace.
- [x] Error response có stable code/traceability khi API được thêm.

#### Verification

- [x] Static contract review: response chỉ gồm `code`, `message` và `traceId`; không serialize `stack`/`cause`.
- [x] `pnpm format:check`.
- [x] `pnpm lint`.
- [x] `pnpm typecheck`.
- [x] `pnpm build`.
- [x] Unit/integration tests: N/A — chưa có API route và test runner thuộc P08.

#### Notes

`src/lib/api/errors.ts` không phụ thuộc Next.js để có thể dùng chung trong Route Handler/service ở
các phase sau. `ApplicationError` chỉ nên nhận message đã được kiểm soát; lỗi không xác định luôn
trả `INTERNAL_ERROR` với message chung. `src/app/error.tsx` cung cấp recovery UI và không hiển thị
chi tiết từ object lỗi.

### P01-T09 — Logging foundation

Status: DONE

#### Subtasks

- [x] P01-T09-S01 — Định nghĩa structured log entry và logger server-only.
- [x] P01-T09-S02 — Hỗ trợ `requestId`/`traceId` context ở top-level.
- [x] P01-T09-S03 — Redact sensitive keys, token-like strings và error internals.

#### Acceptance Criteria

- [x] Structured logging có request/trace context khi phù hợp.
- [x] Không log password, token, cookie, secret hoặc API key.

#### Verification

- [x] Logging redaction review: recursive key/string/error redaction.
- [x] `pnpm format:check`.
- [x] `pnpm lint`.
- [x] `pnpm typecheck`.
- [x] `pnpm build`.

#### Notes

Logger được giữ server-only và không được gắn vào client bundle. Redaction là defensive boundary,
không thay thế policy caller: caller vẫn không được đưa raw request body, credential hoặc secret vào
context. Chưa có Route Handler/service consumer; request context sẽ được truyền vào khi API foundation
được triển khai.

### P01-T10 — Health check

Status: DONE

#### Subtasks

- [x] P01-T10-S01 — Tạo liveness Route Handler cho application process.
- [x] P01-T10-S02 — Đảm bảo response không cache và không chứa secret/infrastructure detail.
- [x] P01-T10-S03 — Ghi rõ dependency readiness checks chỉ thêm khi MySQL/Redis client tồn tại.

#### Acceptance Criteria

- [x] Có health endpoint an toàn cho application; dependency checks được thiết kế để bổ sung khi dependency được thêm.
- [x] Không trả secret hoặc thông tin infrastructure nhạy cảm.

#### Verification

- [x] Endpoint runtime smoke: `GET /api/health` trả HTTP 200 và payload liveness ổn định.
- [x] Response header review: `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`.
- [x] Secret/infrastructure non-exposure review.
- [x] `pnpm format:check`.
- [x] `pnpm lint`.
- [x] `pnpm typecheck`.
- [x] `pnpm build`.

#### Notes

Đây là liveness check, không phải readiness check cho database/Redis. Vì các dependency chưa được
cài đặt hoặc kết nối trong repository hiện tại, endpoint chỉ báo `application: ok`; không trả trạng
thái giả cho dependency chưa tồn tại.

## Phase verification

- P01-T01 verification: **PASS**.
- P01-T02 verification: **PASS**.
- P01-T03 verification: **PASS**.
- P01-T04 verification: **PASS**.
- P01-T05 verification: **PASS**.
- P01-T06 verification: **PASS**.
- P01-T07 verification: **PASS**.
- P01-T08 verification: **PASS**.
- P01-T09 verification: **PASS**.
- P01-T10 verification: **PASS**.
- Remaining P01 tasks: **NONE**.
- Phase status: **DONE**.

## Notes

P01-T01 không khóa product proposition, database schema, session strategy hoặc public information architecture. Các open questions tương ứng vẫn được theo dõi trong discovery/product requirements.
