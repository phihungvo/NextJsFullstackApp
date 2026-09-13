# 00 — PROJECT OVERVIEW

## 1. Trạng thái tài liệu

- **Trạng thái:** Discovery baseline, cập nhật sau khi hoàn tất P01 — Foundation.
- **Ngày rà soát:** 2026-09-13.
- **Mức độ tin cậy:**
  - **Đã xác nhận:** hiện trạng repository và các quy tắc trong `docs/AI_MASTER_PROMPT.md`, `docs/AI_START_PROMPT.md`.
  - **Bắt buộc theo master prompt:** stack, các domain foundation và các nguyên tắc kiến trúc được nêu trong tài liệu master.
  - **Đề xuất tạm thời:** product definition và một số mặc định cần để lập kế hoạch khi chưa có business brief.
  - **Chưa xác định:** các quyết định cần product owner xác nhận; không được coi là requirement cuối cùng.
- **Source of truth:** user requirement → product requirements → architecture → technical documentation → task definition → code → assumption. Tài liệu này không override requirement mới hơn từ product owner.

## 2. Tóm tắt dự án

Đây là nền tảng web **Next.js Fullstack** theo định hướng **SEO-first, production-ready và Modular Monolith**. Next.js App Router đảm nhiệm cả UI và backend boundary; business logic được tách thành validation, authentication, authorization, service và repository; Prisma truy cập MySQL 8; Redis phục vụ các nhu cầu cache/rate limiting/session-related data phù hợp.

Do repository chưa có business brief, tên dự án và domain thương mại chưa được xác nhận. Working definition để lập kế hoạch hiện tại là:

> Một nền tảng quản trị sản phẩm an toàn, có phân quyền RBAC, cho phép người dùng được cấp quyền quản lý product catalog; đồng thời có nền tảng public content để mở rộng thành website SEO-first.

Định nghĩa trên là **provisional**. Nó được suy ra từ domain bắt buộc `User`, `Role`, `Permission`, `Product` và các màn hình/API CRUD trong master prompt; cần được xác nhận trước khi khóa copy, pricing, public content hoặc workflow sản phẩm.

## 3. Discovery report

### 3.1 Project

- Tên dự án: **chưa có trong repository**; master prompt vẫn dùng placeholder `[PROJECT_NAME]`.
- Trạng thái hiện tại: đã có Next.js foundation tối thiểu; domain/infrastructure chưa được implement.
- Tên working không được tự động trở thành tên chính thức. Cần chốt ở P00-T10 hoặc trước khi khởi tạo foundation.

### 3.2 Current architecture

- **Hiện trạng:** đã có Next.js App Router skeleton, error/logging foundation và liveness endpoint; chưa có feature/domain module, database hoặc runtime dependency.
- **Target:** một Next.js Fullstack Application duy nhất, không tách frontend React hoặc backend Spring Boot riêng.
- **Module boundary target:** public/auth/dashboard route groups; feature modules; server services/repositories; shared infrastructure (`db`, `redis`, validation, API, security).

### 3.3 Technology stack

| Hạng mục        | Hiện trạng đã xác nhận  | Target theo master prompt           | Ghi chú                                            |
| --------------- | ----------------------- | ----------------------------------- | -------------------------------------------------- |
| Framework       | Next.js 16.3.5          | Next.js App Router                  | Đã scaffold và build pass                          |
| Language        | TypeScript 5.9.3 strict | TypeScript strict                   | `tsconfig.json` đã được Next.js hoàn thiện         |
| UI              | NOT FOUND               | Ant Design                          | Dùng cho dashboard/shared UI                       |
| Server state    | NOT FOUND               | TanStack Query                      | Chủ yếu cho client interactions                    |
| Form/validation | NOT FOUND               | React Hook Form + Zod               | Backend vẫn là nơi validate cuối                   |
| ORM/database    | Prisma 7.10.0 + schema  | Prisma + MySQL 8                    | Migration/seed đã tạo; runtime verification cần DB |
| Cache/infra     | NOT FOUND               | Redis                               | Không dùng thay cho nguồn dữ liệu chính            |
| Tests           | NOT FOUND               | Vitest, Testing Library, Playwright | Chưa có test runner                                |
| Package manager | pnpm 12.4.1             | pnpm                                | `pnpm-lock.yaml` đã tạo                            |
| Delivery        | NOT FOUND               | Docker + CI/CD                      | Chưa có Dockerfile, Compose hay workflow           |

### 3.4 Repository structure audit

| Path                               | Kết quả   | Ý nghĩa                                         |
| ---------------------------------- | --------- | ----------------------------------------------- |
| `docs/AI_MASTER_PROMPT.md`         | PRESENT   | Quy tắc cấp cao đã đọc toàn bộ                  |
| `docs/AI_START_PROMPT.md`          | PRESENT   | Workflow khởi tạo đã đọc toàn bộ                |
| `docs/00_PROJECT_OVERVIEW.md`      | CREATED   | Tài liệu này                                    |
| `docs/01_PRODUCT_REQUIREMENTS.md`  | CREATED   | Product baseline                                |
| `docs/PROGRESS.md`                 | CREATED   | Theo dõi phase/task                             |
| `docs/tasks/PHASE-00-DISCOVERY.md` | CREATED   | Task register Phase 00                          |
| `package.json`                     | PRESENT   | Foundation scripts/dependencies                 |
| `src/`                             | PRESENT   | App Router skeleton, foundation và health route |
| `prisma/`                          | PRESENT   | Prisma schema, migration và development seed    |
| `public/`                          | NOT FOUND | Chưa có public assets                           |
| `tests/`                           | NOT FOUND | Chưa có test; test runner thuộc P08             |
| `Dockerfile`                       | NOT FOUND | Chưa có container build                         |
| `docker-compose.yml`               | NOT FOUND | Chưa có MySQL/Redis runtime                     |
| `.env.example`                     | PRESENT   | Placeholder environment contract                |
| `.github/`                         | NOT FOUND | Chưa có CI                                      |

Không phát hiện Git metadata hợp lệ tại workspace root (`git status` không chạy được vì đây không phải Git repository). Không có code hiện tại để refactor, nhưng Git initialization/remote là một việc cần xác định ở foundation/DevOps.

### 3.5 Database

Target database là MySQL 8 qua Prisma. Prisma 7.10.0/configuration và server-only client boundary đã
được thiết lập ở P02-T01. Baseline provisional hiện có `User`, `Role`, `Permission`, `Product`, hai
explicit many-to-many join tables, foreign key, unique constraint, index, timestamps và soft-delete
fields cho User/Product. Migration/seed đã tạo; runtime verification cần MySQL service.

### 3.6 Authentication

Target authentication phải dùng cookie bảo mật (`HttpOnly`, `Secure` trong production, `SameSite` phù hợp), password hashing ưu tiên Argon2id, secret từ environment, expiry, logout/revoke và rate limiting. Việc chọn session cookie thuần hay access/refresh token rotation là **chưa chốt**; xem open questions trong mục 12.

### 3.7 Authorization

Target là RBAC kết hợp permission-based authorization. Backend quyết định cuối cùng với `requireAuth()`, `requirePermission()` và deny-by-default; frontend chỉ dùng permission để điều chỉnh UX, không dùng làm security boundary.

### 3.8 API

Target API version là `/api/v1/...`, response có format success/list/error thống nhất, có validation, auth, authorization, trace ID và centralized error handling. Route Handler không chứa business logic lớn; flow chuẩn là request → parse/validate → auth → authorization → service → repository → response.

### 3.9 Frontend

Server Component là mặc định cho public page và dashboard. Client Component chỉ dùng ở vùng cần state, event, browser API, hook hoặc thư viện client-only. Public layout, auth layout và dashboard layout là các boundary mục tiêu; dashboard phải responsive và xử lý loading/empty/error/unauthorized/forbidden/not-found.

### 3.10 SEO

Public content phải server-rendered/indexable, semantic, có Metadata API, canonical, Open Graph, Twitter metadata, sitemap, robots, structured data khi nội dung phù hợp và internal linking. Private dashboard phải `noindex`. Exact public product/content routes chưa thể chốt khi product proposition chưa được xác nhận.

### 3.11 Testing

Hiện chưa có test hoặc test runner. Target test strategy gồm unit (Vitest), component (Testing Library), integration/API và E2E (Playwright), với coverage cho authentication, authorization, product CRUD/validation/pagination/sorting/filtering và security non-exposure. Typecheck, lint, format check và production build của foundation hiện đã pass.

### 3.12 Docker

Hiện chưa có Docker. Target gồm app, MySQL và Redis trong Compose, healthcheck, network, persistent volume phù hợp, environment injection và app image multi-stage chạy non-root với standalone output nếu tương thích.

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

- Authentication: login, logout, current user (`me`), session lifecycle.
- Authorization: User/Role/Permission, RBAC và permission checks.
- Product catalog: list/detail/create/update/delete với pagination, sorting, filtering, search foundation.
- User management: list/detail/create/update/status/assign role, không expose secret fields.
- Role/permission management theo quyền được cấp.
- API `/api/v1` với validation, response/error contract và observability foundation.
- Public SEO shell và private dashboard `noindex`.
- Quality baseline: strict TypeScript, lint/format, tests, security headers, rate-limit abstraction, health check, Docker và CI theo các phase sau.

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
src/lib/                db, redis, validation, api, security utilities
prisma/                 schema, migrations, seed
tests/                  unit, integration, e2e
```

Không tạo hai top-level app giả tạo `frontend/` và `backend/`; boundary nằm trong cùng Next.js application.

## 6. Domain foundation

| Entity       | Vai trò baseline                        | Điểm cần chốt                              |
| ------------ | --------------------------------------- | ------------------------------------------ |
| `User`       | Account đăng nhập và actor của hệ thống | Status, profile fields, lifecycle          |
| `Role`       | Nhóm quyền                              | Naming/code, system role protection        |
| `Permission` | Capability có thể mở rộng               | Catalog permission và seed policy          |
| `Product`    | Đối tượng CRUD trung tâm                | Business meaning, fields, lifecycle/status |

Chưa tạo thêm entity ngoài bốn entity foundation cho đến khi có requirement và data flow rõ ràng.

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

| ID        | Quyết định                                         | Trạng thái                                                | Lý do                                                                                |
| --------- | -------------------------------------------------- | --------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| ADR-00-01 | Chọn Next.js Fullstack Modular Monolith            | Đã xác nhận theo master                                   | Một deployable boundary, module rõ và ít overhead vận hành                           |
| ADR-00-02 | Server Component là mặc định                       | Đã xác nhận theo master                                   | SEO, performance và giảm client JS                                                   |
| ADR-00-03 | MySQL 8 + Prisma                                   | Đã xác nhận theo master                                   | Consistent persistence foundation                                                    |
| ADR-00-04 | RBAC + permission checks ở backend                 | Đã xác nhận theo master                                   | Security boundary không phụ thuộc frontend                                           |
| ADR-00-05 | Product catalog là domain foundation               | Đã xác nhận theo master, business meaning còn provisional | Có yêu cầu Product CRUD/API rõ trong master                                          |
| ADR-00-06 | Không tạo application code ở Phase 00              | Quyết định phase                                          | Chưa có requirement business đủ rõ và user yêu cầu discovery trước                   |
| ADR-01-01 | Dùng package slug lowercase `nextjs-fullstack-app` | Foundation implementation                                 | Tên thư mục hiện hữu có chữ hoa và không được đổi; package name phải hợp lệ theo npm |

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

P01-T01 đã được thực hiện trên provisional baseline sau khi review open questions. Các câu hỏi business vẫn là dependency trước P02 schema, P03 session/auth và public launch; không được coi là đã resolved chỉ vì foundation build pass.

## 11. Technical debt và rủi ro hiện tại

| Mức độ | Vấn đề                                                                         | Impact                                                                                   | Hướng xử lý                                                            |
| ------ | ------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| High   | Chưa có product brief/project name                                             | Có thể xây sai domain, copy và route                                                     | Product owner xác nhận trước khi khóa foundation                       |
| High   | Chưa có auth/API/feature implementation                                        | Database đã có nhưng product chưa thể release                                            | Tiếp tục P03/P04/P05 theo dependency                                   |
| High   | Chưa có auth/session model và role matrix                                      | Ảnh hưởng schema, API và UX                                                              | Chốt ở P03/P04 trước database finalization nếu cần                     |
| Medium | Chưa có hosting, domain, traffic và SLO                                        | Không thể chốt deployment/performance budget                                             | Bổ sung trước Docker/CI/production review                              |
| Medium | `AI_MASTER_PROMPT.md` kết thúc bằng câu chưa hoàn chỉnh                        | Tài liệu master có lỗi biên tập                                                          | Tạo documentation maintenance task; không tự sửa master trong Phase 00 |
| Medium | Workspace chưa có Git metadata hợp lệ                                          | Không có baseline/commit workflow                                                        | Xác minh owner/repository setup ở foundation                           |
| Low    | Master prompt vừa liệt kê `docs/15_PROGRESS.md` vừa yêu cầu `docs/PROGRESS.md` | Dùng `docs/PROGRESS.md` theo workflow chi tiết, `AI_START_PROMPT.md` và yêu cầu hiện tại | Nếu đổi path sẽ ảnh hưởng task tooling/link                            | Ghi nhận, chưa cần block P00 |

## 12. Open questions và assumptions cần xác nhận

| ID       | Câu hỏi/chưa rõ                                                      | Assumption tạm thời                                                               | Impact nếu thay đổi                           | Trạng thái                   |
| -------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------- |
| OQ-00-01 | Tên chính thức và brand/domain là gì?                                | Dùng `[PROJECT_NAME]` trong tài liệu nội bộ                                       | Ảnh hưởng package, metadata, URLs, deployment | BLOCKING trước public launch |
| OQ-00-02 | Product là catalog nội bộ, SaaS quản trị hay domain thương mại khác? | Dùng catalog management làm MVP foundation                                        | Có thể đổi entity, workflow, public IA        | BLOCKING product sign-off    |
| OQ-00-03 | Ai là user ngoài Admin/User seed?                                    | Admin và normal operator là baseline                                              | Ảnh hưởng role matrix và onboarding           | OPEN                         |
| OQ-00-04 | Product cần field, currency, locale, media, inventory nào?           | P02 provisional: field tối thiểu, currency default `USD`, chưa có media/inventory | Ảnh hưởng API/form/SEO                        | OPEN — sign-off trước public |
| OQ-00-05 | Product `status` có các giá trị nào và có draft/publish không?       | P02 provisional: `DRAFT`/`PUBLISHED`/`ARCHIVED`, visibility `PRIVATE`/`PUBLIC`    | Ảnh hưởng workflow/cache/SEO                  | OPEN — sign-off trước public |
| OQ-00-06 | Public product detail có tồn tại không?                              | Public SEO shell có khả năng mở rộng, chưa expose Product mặc định                | Ảnh hưởng slug, indexability, structured data | OPEN                         |
| OQ-00-07 | Session dùng cookie session hay access/refresh tokens?               | Cookie-first; chọn mô hình cụ thể ở P03                                           | Ảnh hưởng DB/Redis/API rotation               | BLOCKING P03                 |
| OQ-00-08 | Hosting, domain, email provider và observability provider?           | Chưa tích hợp external service                                                    | Ảnh hưởng env, Docker, CI/CD, monitoring      | OPEN                         |
| OQ-00-09 | Availability, traffic, p95 latency, backup/RTO/RPO mục tiêu?         | Dùng qualitative NFR cho đến khi có baseline                                      | Ảnh hưởng infra/caching/capacity              | OPEN                         |
| OQ-00-10 | Có yêu cầu multi-tenant, audit log, retention hoặc compliance không? | Không implement ở MVP                                                             | Có thể làm thay đổi data model/security       | OPEN                         |

## 13. Definition of ready cho các phase kế tiếp

Trước P03/P05 và trước khi khóa public product scope, tối thiểu phải có:

- [ ] Product name hoặc quyết định rõ placeholder được dùng đến khi nào.
- [ ] Product proposition và MVP audience được product owner xác nhận hoặc ghi accepted provisional.
- [x] Product field/status/visibility provisional baseline đã được encode cho schema đầu tiên.
- [x] Role/permission baseline đủ để seed và test authorization.
- [ ] Product field/status/visibility baseline được product owner sign-off.
- [ ] Session strategy được chọn hoặc có task decision rõ trong P03.
- [ ] Open question nào chưa chốt phải có owner, impact và phase xử lý.
- [ ] `docs/01_PRODUCT_REQUIREMENTS.md`, `docs/PROGRESS.md` và Phase 00 task file nhất quán.
