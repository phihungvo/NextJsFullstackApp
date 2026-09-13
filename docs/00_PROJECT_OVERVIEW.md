# 00 — PROJECT OVERVIEW

## 1. Trạng thái tài liệu

- **Trạng thái:** Implementation baseline, cập nhật sau khi hoàn tất P05 — Backend API.
- **Ngày rà soát:** 2026-09-14.
- **Mức độ tin cậy:**
  - **Đã xác nhận:** hiện trạng repository và các quy tắc trong `docs/AI_MASTER_PROMPT.md`, `docs/AI_START_PROMPT.md`.
  - **Bắt buộc theo master prompt:** stack, các domain foundation và các nguyên tắc kiến trúc được nêu trong tài liệu master.
  - **Đề xuất tạm thời:** product definition và một số mặc định cần để lập kế hoạch khi chưa có business brief.
  - **Chưa xác định:** các quyết định cần product owner xác nhận; không được coi là requirement cuối cùng.
- **Source of truth:** user requirement → product requirements → architecture → technical documentation → task definition → code → assumption. Tài liệu này không override requirement mới hơn từ product owner.

## 2. Tóm tắt dự án

Đây là nền tảng web **Next.js Fullstack** theo định hướng **SEO-first, production-ready và Modular Monolith**. Next.js App Router đảm nhiệm cả UI và backend boundary; business logic được tách thành validation, authentication, authorization, service và repository; Prisma truy cập MySQL 8; Redis phục vụ rate limiting và các nhu cầu cache/session-related data phù hợp.

Do repository chưa có business brief, tên dự án và domain thương mại chưa được xác nhận. Working definition để lập kế hoạch hiện tại là:

> Một nền tảng quản trị sản phẩm an toàn, có phân quyền RBAC, cho phép người dùng được cấp quyền quản lý product catalog; đồng thời có nền tảng public content để mở rộng thành website SEO-first.

Định nghĩa trên là **provisional**. Nó được suy ra từ domain bắt buộc `User`, `Role`, `Permission`, `Product` và các màn hình/API CRUD trong master prompt; cần được xác nhận trước khi khóa copy, pricing, public content hoặc workflow sản phẩm.

## 3. Discovery report

### 3.1 Project

- Tên dự án: **chưa có trong repository**; master prompt vẫn dùng placeholder `[PROJECT_NAME]`.
- Trạng thái hiện tại: đã có Next.js foundation, database baseline, authentication, authorization,
  versioned Product/User/Role/Permission API và P06 frontend baseline.
- Tên working không được tự động trở thành tên chính thức. Cần chốt ở P00-T10 hoặc trước khi khởi tạo foundation.

### 3.2 Current architecture

- **Hiện trạng:** đã có Next.js App Router skeleton, error/logging foundation, liveness endpoint,
  Prisma/MySQL domain baseline, server-only authentication boundary, authorization service/guards,
  versioned backend API cho Product/User/Role/Permission và frontend route/UI baseline của P06.
- **Target:** một Next.js Fullstack Application duy nhất, không tách frontend React hoặc backend Spring Boot riêng.
- **Module boundary target:** public/auth/dashboard route groups; feature modules; server services/repositories; shared infrastructure (`db`, `redis`, validation, API, security).

### 3.3 Technology stack

| Hạng mục        | Hiện trạng đã xác nhận              | Target theo master prompt           | Ghi chú                                                  |
| --------------- | ----------------------------------- | ----------------------------------- | -------------------------------------------------------- |
| Framework       | Next.js 16.3.5                      | Next.js App Router                  | Đã scaffold và build pass                                |
| Language        | TypeScript 5.9.3 strict             | TypeScript strict                   | `tsconfig.json` đã được Next.js hoàn thiện               |
| UI              | Semantic HTML/CSS primitives (P06)  | Ant Design                          | Chưa thêm UI dependency; target integration còn mở       |
| Server state    | Native fetch/client state (P06)     | TanStack Query                      | Có thể thay thế khi query complexity tăng                |
| Form/validation | Native controlled forms + Zod API   | React Hook Form + Zod               | Backend vẫn là nơi validate cuối                         |
| ORM/database    | Prisma 7.10.0 + schema              | Prisma + MySQL 8                    | Migration/seed/session đã tạo; đã verify temporary MySQL |
| Cache/infra     | Redis client + login rate limit     | Redis                               | Không dùng thay cho nguồn dữ liệu chính                  |
| Tests           | Vitest + auth/authz/API route tests | Vitest, Testing Library, Playwright | Component/E2E thuộc P08                                  |
| Package manager | pnpm 12.4.1                         | pnpm                                | `pnpm-lock.yaml` đã tạo                                  |
| Delivery        | Dockerfile + Compose (P10)          | Docker + CI/CD                      | Docker đã có; CI/CD vẫn chưa tích hợp                    |

### 3.4 Repository structure audit

| Path                                    | Kết quả   | Ý nghĩa                                           |
| --------------------------------------- | --------- | ------------------------------------------------- |
| `docs/AI_MASTER_PROMPT.md`              | PRESENT   | Quy tắc cấp cao đã đọc toàn bộ                    |
| `docs/AI_START_PROMPT.md`               | PRESENT   | Workflow khởi tạo đã đọc toàn bộ                  |
| `docs/00_PROJECT_OVERVIEW.md`           | CREATED   | Tài liệu này                                      |
| `docs/01_PRODUCT_REQUIREMENTS.md`       | CREATED   | Product baseline                                  |
| `docs/PROGRESS.md`                      | CREATED   | Theo dõi phase/task                               |
| `docs/tasks/PHASE-00-DISCOVERY.md`      | CREATED   | Task register Phase 00                            |
| `docs/tasks/PHASE-03-AUTHENTICATION.md` | CREATED   | Task register Phase 03                            |
| `docs/tasks/PHASE-04-AUTHORIZATION.md`  | CREATED   | Task register Phase 04                            |
| `docs/tasks/PHASE-05-BACKEND-API.md`    | CREATED   | Task register Phase 05                            |
| `package.json`                          | PRESENT   | Foundation scripts/dependencies                   |
| `src/`                                  | PRESENT   | App Router, foundation, auth/authz routes/modules |
| `src/app/api/v1/`                       | PRESENT   | Auth, Product, User, Role, Permission API routes  |
| `src/server/api/`                       | PRESENT   | Query/payload schema và route response helpers    |
| `src/server/services/`                  | PRESENT   | Product/User/Role/Permission use cases            |
| `src/server/repositories/`              | PRESENT   | Prisma data access và public field selections     |
| `prisma/`                               | PRESENT   | Schema, migrations, seed và Session model         |
| `public/`                               | PRESENT   | Static asset directory; hiện là baseline rỗng     |
| `tests/`                                | PRESENT   | Vitest auth/authz unit và route tests             |
| `Dockerfile`                            | PRESENT   | Multi-stage development/standalone/migrator       |
| `docker-compose.yml`                    | PRESENT   | Development app + MySQL + Redis + migration       |
| `.env.example`                          | PRESENT   | Placeholder environment contract                  |
| `.github/`                              | NOT FOUND | Chưa có CI                                        |

Git metadata hiện diện tại workspace root và `git status`/`git rev-parse` hoạt động. Remote/commit
workflow của repository chưa được xác nhận; cần chốt trước khi thiết lập CI/CD hoặc release baseline.

### 3.5 Database

Target database là MySQL 8 qua Prisma. Prisma 7.10.0/configuration và server-only client boundary đã
được thiết lập ở P02-T01. Baseline provisional hiện có `User`, `Role`, `Permission`, `Product`, `Session`,
hai explicit many-to-many join tables, foreign key, unique constraint, index, timestamps và soft-delete
fields cho User/Product. `Session` được thêm bằng migration riêng ở P03, lưu HMAC token hash, expiry,
revoke state và last-seen tracking; migration/seed đã được runtime verify trên temporary MySQL.

### 3.6 Authentication

P03 đã triển khai authentication web-first bằng opaque database-backed session. Cookie chỉ chứa random
token; database lưu HMAC-SHA-256 hash với `AUTH_SECRET`, expiry 8 giờ, revoke state và `lastSeenAt`.
Cookie dùng `HttpOnly`, `SameSite=Lax`, `Path=/`, thêm `Secure` và tên `__Host-session` ở production.
Login dùng Argon2id, generic credential error và Redis rate limit 5 attempts/60 giây theo email + client
address. Refresh-token pair/endpoint được skip có chủ đích vì MVP chỉ có web client; chỉ mở lại khi có
external client hoặc requirement long-lived session.

### 3.7 Authorization

P04 đã triển khai RBAC kết hợp permission-based authorization. `requireAuth()` kiểm tra session trước;
`getUserPermissionCodes()`/`hasPermission()` resolve authoritative data từ MySQL; `requirePermission()`
trả `401` cho anonymous và `403` cho user thiếu quyền qua centralized error contract. `can()` ở
`src/features/auth/permissions.ts` chỉ là UX helper, không phải security boundary. Admin seed có toàn bộ
16 permission baseline; User seed có `PRODUCT_VIEW`.

### 3.8 API

P05 đã triển khai API version `/api/v1/...` cho auth, Product, User, Role và Permission. Response dùng
format success/list/error thống nhất; backend validate bằng Zod; Route Handler enforce authentication và
permission trước khi gọi service/repository; lỗi có `traceId`, `timestamp`, `path` và không serialize
stack/SQL/secret. Flow chuẩn là request → parse/validate → auth → authorization → service → repository
→ response.

| Resource   | Endpoints đã triển khai                           | Capability chính                                             |
| ---------- | ------------------------------------------------- | ------------------------------------------------------------ |
| Auth       | `/api/v1/auth/login`, `/logout`, `/me`            | Session web-first                                            |
| Product    | `/api/v1/products`, `/api/v1/products/[id]`       | List/detail/create/update/archive                            |
| User       | `/api/v1/users`, `/api/v1/users/[id]`             | List/detail/create/update/status/role assignment/soft delete |
| Role       | `/api/v1/roles`, `/api/v1/roles/[id]`             | List/detail/create/update/delete/permission assignment       |
| Permission | `/api/v1/permissions`, `/api/v1/permissions/[id]` | List/detail từ catalog database                              |

List API có pagination (`page`, `pageSize`, mặc định `1/20`, tối đa `100`), search, filter theo resource
và sort whitelist với `sortOrder` `asc|desc`. Product hỗ trợ filter `status`/`visibility`; User hỗ trợ
filter `status`; Role/Permission hỗ trợ search. Query key generic `filter` được master prompt nêu nhưng
chưa có encoding/grammar; P05 giữ typed filters để tránh tự ý chốt syntax, cần quyết định trước khi mở
filter động.

### 3.9 Frontend

Server Component là mặc định cho public page và dashboard. Client Component chỉ dùng ở vùng cần state, event, browser API, hook hoặc thư viện client-only. P06 đã hiện thực public layout, auth layout và dashboard layout; dashboard responsive và xử lý loading/empty/error/unauthorized/forbidden/not-found.

### 3.10 SEO

Public content phải server-rendered/indexable, semantic, có Metadata API, canonical, Open Graph, Twitter metadata, sitemap, robots, structured data khi nội dung phù hợp và internal linking. Private dashboard phải `noindex`. Exact public product/content routes chưa thể chốt khi product proposition chưa được xác nhận.

### 3.11 Testing

P03 đã thêm Vitest với unit/route tests cho password, opaque token và authentication contract; P04 bổ sung
authorization service/helper/403 tests; P05 bổ sung API route/response tests và runtime smoke test trên
MySQL 8 + Redis; P06 đã verify frontend build/route baseline. Hiện `pnpm test` pass 25 tests. Target test strategy vẫn gồm component (Testing Library),
integration/API và E2E (Playwright), với coverage mở rộng cho dashboard và security. Typecheck, lint,
format check, test và production build là quality gates của mỗi phase.

### 3.12 Docker

P10 đã triển khai Docker thực tế. `Dockerfile` dùng multi-stage `deps`, `development`, `builder`,
`migrator` và non-root `runner` với Next `output: "standalone"`. `docker-compose.yml` dành cho
development có hot reload, MySQL 8.4, Redis 7.4, named volumes, healthchecks, migration service và seed
profile. `docker-compose.prod.yml` không publish MySQL/Redis ra host, chạy migration trước app và inject
runtime environment qua Compose. Chi tiết ở `docs/09_DOCKER_DEPLOYMENT.md`.

### 3.13 CI/CD

Hiện chưa có CI/CD. Foundation dự kiến thêm pipeline chạy install, lint, typecheck, unit/integration test và build; E2E được thêm khi môi trường CI phù hợp. Chưa xác định hosting, registry, deployment strategy hoặc production secrets provider.

## 4. Product framing tạm thời

### 4.1 Mục tiêu sản phẩm

Mục tiêu baseline cần xác nhận:

1. Cung cấp một nền tảng quản trị product catalog có kiểm soát quyền truy cập.
2. Đảm bảo các thao tác nhạy cảm (đăng nhập, CRUD, gán role/permission) được bảo vệ ở backend.
3. Tạo nền tảng public content có thể crawl tốt và mở rộng về blog, documentation, landing page hoặc product page.
4. Giữ các capability trong một modular monolith để giảm vận hành ban đầu nhưng không khóa đường mở rộng.

### 4.2 Phạm vi MVP baseline

- Authentication: login, logout, current user (`me`), opaque DB session lifecycle và Redis login rate limit (P03 đã implement).
- Authorization: User/Role/Permission, RBAC, server guards và deny-by-default checks (P04 đã implement).
- Product catalog: list/detail/create/update/archive với pagination, sorting, filtering, search foundation
  (P05 đã implement; product business policy vẫn provisional).
- User management: list/detail/create/update/status/assign role/soft delete, không expose secret fields
  (P05 đã implement).
- Role/permission management theo quyền được cấp (P05 đã implement list/detail/CRUD cần thiết).
- API `/api/v1` với validation, response/error contract, traceability và server-side authorization
  (P05 đã implement).
- Public SEO shell và private dashboard `noindex`.
- Quality baseline: strict TypeScript, lint/format, tests, security headers, rate-limit abstraction,
  health check và Docker đã có; CI vẫn thuộc phase sau.

### 4.3 Ngoài phạm vi MVP

Chưa triển khai subscription, payment, notification/email, file upload, advanced search engine, analytics, AI, blog CMS hoàn chỉnh, multi-tenant, background job platform, microservices, Kafka, Elasticsearch, Kubernetes, GraphQL hoặc CQRS nếu chưa có requirement mới.

## 5. Target architecture

```text
Browser / Search Engine
          |
          v
Next.js App Router (Server Components by default)
          |
     +----+--------------------+
     |                         |
 Public/Auth/Dashboard     Route Handlers / Server Actions
     |                         |
     |             validation -> auth -> authorization
     |                                      |
     +-------------------------------> services
                                            |
                                      repositories
                                       /        \
                                    Prisma     Redis
                                      |
                                   MySQL 8
```

Target module layout (boundary marker đã tạo ở P01-T05; implementation sẽ thêm theo consumer, không tạo code placeholder):

```text
src/app/(public)/       public SEO routes
src/app/(auth)/         authentication routes
src/app/(dashboard)/    private application routes
src/app/api/v1/        versioned API
src/features/           feature-oriented UI/query/schema code
src/server/services/    business orchestration
src/server/repositories/ data access
src/server/auth/        session/authentication
src/server/authorization/ permission checks
src/server/api/           schemas, pagination và response adapters
src/lib/                db, redis, validation, api, security utilities
prisma/                 schema, migrations, seed
tests/                  unit, integration, e2e
```

Không tạo hai top-level app giả tạo `frontend/` và `backend/`; boundary nằm trong cùng Next.js application.

## 6. Domain foundation

| Entity       | Vai trò baseline                          | Điểm cần chốt                               |
| ------------ | ----------------------------------------- | ------------------------------------------- |
| `User`       | Account đăng nhập và actor của hệ thống   | Status, profile fields, lifecycle           |
| `Role`       | Nhóm quyền                                | Naming/code, system role protection         |
| `Permission` | Capability có thể mở rộng                 | Catalog permission và seed policy           |
| `Product`    | Đối tượng CRUD trung tâm                  | Business meaning, fields, lifecycle/status  |
| `Session`    | Opaque authentication session của web MVP | Retention/cleanup, external-client strategy |

`Session` là infrastructure entity được thêm ở P03 để phục vụ authentication; không mở rộng thêm domain
entity ngoài baseline trên cho đến khi có requirement và data flow rõ ràng.

## 7. NFR baseline

- **Security:** server-side validation; least privilege; deny by default; secret không vào source/bundle/log; không trả password hash/token; cookie bảo mật; rate limiting cho endpoint nhạy cảm; generic auth errors.
- **SEO:** public content indexable và server-rendered; dashboard noindex; metadata/canonical/social cards/sitemap/robots; semantic HTML; structured data chỉ khi đúng nội dung.
- **Performance:** giảm client JavaScript; tránh server-to-internal-API round trip khi Server Component có thể gọi service; pagination; tránh N+1; image/font optimization; caching chỉ khi đúng public/private boundary.
- **Reliability:** centralized errors, request/trace ID, health check cho app/database/Redis khi phù hợp, transaction cho multi-step invariant.
- **Maintainability:** feature-based organization, service/repository separation, strict types, no circular imports, one package manager, documentation kept current.
- **Accessibility/responsive:** semantic HTML, labels, keyboard/focus/contrast, desktop/tablet/mobile support.
- **Operability:** structured logs không chứa secret, environment contract, Docker/CI verification.

Các SLO, latency budget, traffic target, retention và backup/RTO/RPO chưa có dữ liệu để chốt; xem mục 12.

## 8. Constraints

1. Bắt buộc dùng Next.js Fullstack + App Router + TypeScript; không tạo Spring Boot hoặc React frontend độc lập.
2. Bắt buộc dùng MySQL 8 + Prisma và Redis theo master prompt.
3. UI stack baseline là Ant Design; state/form/validation baseline là TanStack Query, React Hook Form và Zod.
4. Không code application ở Phase 00 trừ khi discovery sau này chứng minh cần scaffold; phase này chỉ tạo source-of-truth và task plan.
5. Không tự chốt tên dự án, business model, public content taxonomy, pricing, role matrix chi tiết hoặc Product schema cuối cùng. Provisional schema dùng để unblock implementation phải được ghi rõ và chờ sign-off.
6. Không overengineer thành distributed system trước khi có scale/ownership requirement.
7. Documentation phải phân biệt implemented, target và assumption.

## 9. Decision log

| ID        | Quyết định                                               | Trạng thái                                                | Lý do                                                                                |
| --------- | -------------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ADR-00-01 | Chọn Next.js Fullstack Modular Monolith                  | Đã xác nhận theo master                                   | Một deployable boundary, module rõ và ít overhead vận hành                           |
| ADR-00-02 | Server Component là mặc định                             | Đã xác nhận theo master                                   | SEO, performance và giảm client JS                                                   |
| ADR-00-03 | MySQL 8 + Prisma                                         | Đã xác nhận theo master                                   | Consistent persistence foundation                                                    |
| ADR-00-04 | RBAC + permission checks ở backend                       | Đã xác nhận theo master                                   | Security boundary không phụ thuộc frontend                                           |
| ADR-00-05 | Product catalog là domain foundation                     | Đã xác nhận theo master, business meaning còn provisional | Có yêu cầu Product CRUD/API rõ trong master                                          |
| ADR-00-06 | Không tạo application code ở Phase 00                    | Quyết định phase                                          | Chưa có requirement business đủ rõ và user yêu cầu discovery trước                   |
| ADR-01-01 | Dùng package slug lowercase `nextjs-fullstack-app`       | Foundation implementation                                 | Tên thư mục hiện hữu có chữ hoa và không được đổi; package name phải hợp lệ theo npm |
| ADR-05-01 | API response/error contract dùng helper tập trung        | Đã implement ở P05                                        | Giữ format ổn định, traceability và không leak lỗi nội bộ giữa các resource          |
| ADR-05-02 | Pagination/sort/filter validate và whitelist ở server    | Đã implement ở P05                                        | Không cho client đưa field tùy ý vào Prisma order/filter                             |
| ADR-05-03 | Product delete và User delete dùng soft-delete/lifecycle | Đã implement ở P05                                        | Bảo toàn dữ liệu baseline và revoke session khi user bị xóa                          |

## 10. Phase dependency và implementation plan

```text
P00 Discovery & Definition
          |
P01 Foundation
          |
P02 Database
          |
P03 Authentication -> P04 Authorization
          |
P05 Backend API -> P06 Frontend
          |
P07 SEO + P08 Testing + P09 Security
          |
P10 Docker -> P11 CI/CD -> P12 Final Review
```

P01-T01, P02, P03, P04 và P05 đã được thực hiện trên provisional baseline sau khi review open questions.
Các câu hỏi business vẫn là dependency trước public launch; session strategy đã có quyết định kỹ thuật
tạm thời cho web-only MVP nhưng vẫn phải revisit nếu xuất hiện client ngoài web.

## 11. Technical debt và rủi ro hiện tại

| Mức độ | Vấn đề                                                                         | Impact                                                                                   | Hướng xử lý                                                            |
| ------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| High   | Chưa có product brief/project name                                             | Có thể xây sai domain, copy và route                                                     | Product owner xác nhận trước khi khóa foundation                       |
| High   | Public IA/SEO và product sign-off chưa chốt                                    | Có thể xây sai public content và metadata                                                | Tiếp tục P07 sau khi owner xác nhận                                    |
| High   | Role matrix chi tiết và product proposition chưa sign-off                      | Ảnh hưởng authorization, UX và public scope                                              | Chốt ở P05/P07 trước release                                           |
| Medium | Chưa có hosting, domain, traffic và SLO                                        | Không thể chốt deployment/performance budget                                             | Bổ sung trước CI/production review                                     |
| Medium | `AI_MASTER_PROMPT.md` kết thúc bằng câu chưa hoàn chỉnh                        | Tài liệu master có lỗi biên tập                                                          | Tạo documentation maintenance task; không tự sửa master trong Phase 00 |
| Medium | Git remote/commit workflow chưa được xác nhận                                  | Không có release baseline/CI ownership rõ ràng                                           | Xác minh owner/repository setup trước CI/CD                            |
| Low    | Master prompt vừa liệt kê `docs/15_PROGRESS.md` vừa yêu cầu `docs/PROGRESS.md` | Dùng `docs/PROGRESS.md` theo workflow chi tiết, `AI_START_PROMPT.md` và yêu cầu hiện tại | Nếu đổi path sẽ ảnh hưởng task tooling/link                            | Ghi nhận, chưa cần block P00 |

## 12. Open questions và assumptions cần xác nhận

| ID       | Câu hỏi/chưa rõ                                                      | Assumption tạm thời                                                               | Impact nếu thay đổi                           | Trạng thái                                |
| -------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------- | ----------------------------------------- |
| OQ-00-01 | Tên chính thức và brand/domain là gì?                                | Dùng `[PROJECT_NAME]` trong tài liệu nội bộ                                       | Ảnh hưởng package, metadata, URLs, deployment | BLOCKING trước public launch              |
| OQ-00-02 | Product là catalog nội bộ, SaaS quản trị hay domain thương mại khác? | Dùng catalog management làm MVP foundation                                        | Có thể đổi entity, workflow, public IA        | BLOCKING product sign-off                 |
| OQ-00-03 | Ai là user ngoài Admin/User seed?                                    | Admin và normal operator là baseline                                              | Ảnh hưởng role matrix và onboarding           | OPEN                                      |
| OQ-00-04 | Product cần field, currency, locale, media, inventory nào?           | P02 provisional: field tối thiểu, currency default `USD`, chưa có media/inventory | Ảnh hưởng API/form/SEO                        | OPEN — sign-off trước public              |
| OQ-00-05 | Product `status` có các giá trị nào và có draft/publish không?       | P02 provisional: `DRAFT`/`PUBLISHED`/`ARCHIVED`, visibility `PRIVATE`/`PUBLIC`    | Ảnh hưởng workflow/cache/SEO                  | OPEN — sign-off trước public              |
| OQ-00-06 | Public product detail có tồn tại không?                              | Public SEO shell có khả năng mở rộng, chưa expose Product mặc định                | Ảnh hưởng slug, indexability, structured data | OPEN                                      |
| OQ-00-07 | Session dùng cookie session hay access/refresh tokens?               | Opaque DB session 8 giờ cho web-only MVP; không refresh pair                      | Ảnh hưởng DB/Redis/API rotation               | RESOLVED FOR MVP; revisit external client |
| OQ-00-08 | Hosting, domain, email provider và observability provider?           | Chưa tích hợp external service                                                    | Ảnh hưởng env, Docker, CI/CD, monitoring      | OPEN                                      |
| OQ-00-09 | Availability, traffic, p95 latency, backup/RTO/RPO mục tiêu?         | Dùng qualitative NFR cho đến khi có baseline                                      | Ảnh hưởng infra/caching/capacity              | OPEN                                      |
| OQ-00-10 | Có yêu cầu multi-tenant, audit log, retention hoặc compliance không? | Không implement ở MVP                                                             | Có thể làm thay đổi data model/security       | OPEN                                      |

## 13. Definition of ready cho các phase kế tiếp

Sau P06 và trước khi khóa public product scope, tối thiểu phải có:

- [ ] Product name hoặc quyết định rõ placeholder được dùng đến khi nào.
- [ ] Product proposition và MVP audience được product owner xác nhận hoặc ghi accepted provisional.
- [x] Product field/status/visibility provisional baseline đã được encode cho schema đầu tiên.
- [x] Role/permission baseline đủ để seed và test authorization.
- [ ] Product field/status/visibility baseline được product owner sign-off.
- [x] Session strategy web-only được chọn và ghi rõ trong P03; refresh-token strategy được đánh dấu skip có điều kiện.
- [x] Authorization baseline `requireAuth`/`requirePermission`, 401/403 contract và deny-by-default đã được triển khai ở P04.
- [x] API response/error contract, validation, pagination, sorting, filtering và resource routes đã được triển khai ở P05.
- [x] `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm test` và `pnpm build` đã pass sau P05.
- [ ] Open question nào chưa chốt phải có owner, impact và phase xử lý.
- [ ] `docs/01_PRODUCT_REQUIREMENTS.md`, `docs/PROGRESS.md` và Phase 00 task file nhất quán.
