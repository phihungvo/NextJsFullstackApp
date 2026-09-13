# 01 — PRODUCT REQUIREMENTS

## 1. Trạng thái và phạm vi của tài liệu

- **Trạng thái:** Product baseline/provisional sau P05; chưa phải business sign-off cuối cùng.
- **Ngày:** 2026-09-14.
- **Mục đích:** làm source of truth cho product scope, functional requirements và acceptance baseline của các phase sau.
- **Implementation note:** P01 đã tạo foundation scaffold, error/logging contract và liveness endpoint;
  P02 đã tạo provisional Prisma/MySQL domain schema, migration và development seed; P03 đã implement
  web authentication (login/logout/me, opaque session, Argon2id và Redis rate limiting); P04 đã implement
  server RBAC/permission guards và frontend capability helper; P05 đã implement versioned backend API,
  P06 đã implement frontend route/UI baseline.
- **Cách đọc:** `MUST` là baseline bắt buộc theo requirement/master prompt; `SHOULD` là ưu tiên nên có; `TBD` là vấn đề chưa đủ thông tin, không được tự chốt ngầm.
- **Product proposition chưa được cung cấp:** các phần được đánh dấu **[PROVISIONAL]** phải được xác nhận trước khi public launch và trước khi khóa schema/domain chi tiết.

## 2. Product definition

### 2.1 Working definition [PROVISIONAL]

Sản phẩm là nền tảng web giúp một tổ chức quản lý product catalog trong vùng private có authentication và phân quyền theo role/permission, đồng thời cung cấp nền tảng public SEO-first để giới thiệu hoặc xuất bản nội dung sản phẩm khi business xác nhận.

Đây là cách diễn giải tối thiểu từ master prompt, không phải khẳng định về ngành, business model hay end-customer. Nếu product thực tế không phải catalog management, cần thay đổi tài liệu này trước P01 thay vì xây tiếp theo assumption.

### 2.2 Vấn đề cần giải quyết [PROVISIONAL]

Các nhóm vận hành cần một nơi thống nhất để:

- đăng nhập an toàn và chỉ thấy thao tác được cấp quyền;
- quản lý product records với dữ liệu hợp lệ, có tìm kiếm/lọc/phân trang;
- quản lý user, role và permission mà không đưa security decision xuống frontend;
- có public pages tải tốt, semantic và có thể được search engine lập chỉ mục.

Mức độ nghiêm trọng, quy trình hiện tại và baseline đo lường chưa được cung cấp; không coi các giả định trên là validated market problem.

### 2.3 Mục tiêu sản phẩm

1. Tạo MVP quản trị product catalog có thể kiểm soát truy cập bằng backend authorization.
2. Tạo nền tảng public có SEO kỹ thuật đúng ngay từ đầu, không phải retrofit sau khi dashboard hoàn tất.
3. Cung cấp module boundaries đủ rõ để thêm subscription, blog/CMS, notification, analytics hoặc multi-tenant khi có requirement.
4. Đạt production-readiness foundation về security, validation, testing, observability, Docker và CI trước khi release.

### 2.4 Không phải mục tiêu MVP

- Không phải marketplace, payment platform hoặc full CMS nếu chưa có requirement.
- Không xây microservices hoặc distributed workflow chỉ để “chuẩn bị scale”.
- Không xây advanced search/analytics/AI/file management trước khi có use case, data volume và owner.
- Không để public SEO content phụ thuộc vào toàn bộ client-side JavaScript.

## 3. Đối tượng sử dụng và quyền hạn

| Persona            | Nhu cầu                                    | Baseline access               | Ghi chú                               |
| ------------------ | ------------------------------------------ | ----------------------------- | ------------------------------------- |
| Public visitor     | Đọc public pages và nội dung được publish  | Không cần login               | Search engine là một actor quan trọng |
| Admin              | Quản trị user, role, permission và product | Đầy đủ permission theo policy | Có thể có system-role protection; TBD |
| Product operator   | Quản lý product trong phạm vi được cấp     | Product permissions           | Không mặc định có quyền user/role     |
| Authenticated user | Sử dụng dashboard được cấp quyền           | Deny by default               | Tên role và workflow cần chốt         |

### 3.1 Role/permission baseline

Master prompt yêu cầu seed `Admin Role` và `User Role`, nhưng chưa định nghĩa matrix cuối cùng. Permission catalog tối thiểu cần bao phủ:

- `PRODUCT_VIEW`, `PRODUCT_CREATE`, `PRODUCT_UPDATE`, `PRODUCT_DELETE`;
- `USER_VIEW`, `USER_CREATE`, `USER_UPDATE`, `USER_DELETE`;
- `ROLE_VIEW`, `ROLE_CREATE`, `ROLE_UPDATE`, `ROLE_DELETE`;
- quyền quản lý/assign permission tương ứng nếu role management cho phép.

Admin không được hiểu là bypass mọi policy nếu chưa có quyết định system-role rõ ràng. Backend phải là enforcement point.

## 4. Product scope và ưu tiên

### 4.1 MVP — MUST

1. Login, logout, current-user và session lifecycle an toàn.
2. RBAC/permission-based authorization ở backend.
3. Product list/detail/create/update/delete.
4. Product list có foundation cho pagination, search, filtering và whitelist sorting.
5. User list/detail/create/update/status/assign role, không trả password/passwordHash/token/secret.
6. Role list/create/update/delete và assign permissions theo authorization policy.
7. Permission list/detail, với dữ liệu hệ thống mở rộng được.
8. Versioned API dưới `/api/v1` với success/list/error contract nhất quán.
9. Public route foundation server-rendered và private route foundation `noindex`.
10. Validation, centralized error handling, structured logging, rate-limit abstraction, security headers và health-check foundation.
11. TypeScript strict, lint/format, unit/component/integration/E2E test strategy, Docker và CI theo phase.

### 4.2 SHOULD

- Empty/loading/error/unauthorized/forbidden/not-found states rõ ràng.
- Responsive dashboard cho desktop/tablet/mobile.
- Metadata API, canonical, Open Graph, Twitter Cards, sitemap, robots và JSON-LD khi phù hợp.
- Request ID/trace ID và error correlation.
- Transaction cho thao tác nhiều bước; unique constraints/idempotency cho race condition phù hợp.
- Caching public content có kiểm soát; không cache nhầm dữ liệu private.

### 4.3 LATER / OUT OF SCOPE

Subscription, payment, email/notification, upload, blog CMS, docs CMS, advanced search, analytics, AI, background jobs, multi-tenant, audit/event stream, external integrations và các distributed technologies. Mỗi capability cần requirement, owner, data/security review riêng.

## 5. Functional requirements

### 5.1 Authentication

| ID         | Requirement                               | Acceptance baseline                                                                                                       |
| ---------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| FR-AUTH-01 | User có thể login bằng credential hợp lệ  | Tạo authenticated session; không trả password/token nhạy cảm trong body/log                                               |
| FR-AUTH-02 | Credential sai hoặc account không tồn tại | Trả lỗi generic phù hợp; không leak user existence; áp dụng rate limiting                                                 |
| FR-AUTH-03 | User có thể logout                        | Session/token hợp lệ bị invalidated/revoked theo session strategy                                                         |
| FR-AUTH-04 | User có thể lấy current user              | Chỉ authenticated request thành công; response không chứa secret fields                                                   |
| FR-AUTH-05 | Session được bảo vệ                       | P03: opaque DB-backed session 8 giờ; cookie HttpOnly, Secure production, SameSite=Lax, Path=/; DB chỉ lưu HMAC token hash |
| FR-AUTH-06 | Password được lưu an toàn                 | Hash Argon2id ưu tiên; secret/config chỉ từ environment                                                                   |

Implemented P03 endpoints: `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/me`.
Refresh endpoint được **SKIPPED có chủ đích** cho web-only MVP; nếu có external client hoặc yêu cầu
long-lived session, phải có decision về rotation/revoke trước khi thêm route.

### 5.2 Authorization

| ID       | Requirement                                          | Acceptance baseline                                             |
| -------- | ---------------------------------------------------- | --------------------------------------------------------------- |
| FR-AZ-01 | Mọi private operation yêu cầu authentication         | Server guard `requireAuth()`; anonymous request nhận `401`      |
| FR-AZ-02 | Permission được kiểm tra ở backend                   | `requirePermission()` kiểm tra database; thiếu quyền nhận `403` |
| FR-AZ-03 | User/Role/Permission relationships được lưu bền vững | Có FK/unique/index và transaction phù hợp                       |
| FR-AZ-04 | Frontend phản ánh capability                         | Ẩn/disable UX khi cần nhưng không được là security boundary     |
| FR-AZ-05 | Authorization deny by default                        | Unknown/unassigned permission bị deny; không wildcard implicit  |

P04 baseline: `ADMIN` seed có toàn bộ 16 permission codes; `USER` seed chỉ có `PRODUCT_VIEW`. Đây là
baseline kỹ thuật để unblock API, chưa phải role matrix business sign-off cuối cùng.

### 5.3 Product management

| ID         | Requirement              | Acceptance baseline                                                                                  |
| ---------- | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| FR-PROD-01 | Xem product list         | Có pagination; loading/success/empty/error; chỉ trả field được phép                                  |
| FR-PROD-02 | Xem product detail       | Có not-found handling; public/private visibility theo provisional policy, public launch cần sign-off |
| FR-PROD-03 | Tạo product              | Backend Zod validation; permission check; duplicate/conflict được xử lý rõ                           |
| FR-PROD-04 | Cập nhật product         | Backend validation + authorization; không overwrite field ngoài contract                             |
| FR-PROD-05 | Xóa hoặc archive product | P02 dùng soft delete + `ARCHIVED` baseline; hard delete chưa expose                                  |
| FR-PROD-06 | Tìm kiếm/lọc/sắp xếp     | Query params chuẩn; sort/filter fields whitelist; không đưa input thô vào query                      |
| FR-PROD-07 | Product data integrity   | Timestamps, status policy, unique slug/code nếu domain cần; index dựa trên query pattern             |

> **Provisional P02 baseline:** Product có `name`, `slug`, `description`, `price`, `currency`,
> `status` (`DRAFT`/`PUBLISHED`/`ARCHIVED`), `visibility` (`PRIVATE`/`PUBLIC`), timestamps và
> `deletedAt`. Currency default hiện là `USD`; media, locale, inventory, publish workflow chi tiết
> và business meaning vẫn cần product-owner sign-off trước public launch. Thay đổi sau migration phải
> tạo migration mới.

P05 đã hiện thực hóa baseline này qua `/api/v1/products` và `/api/v1/products/[id]`: list/detail/create/
update/archive, validation `price`/`slug`/status/visibility, duplicate slug conflict và query
pagination/search/filter/sort whitelist. `DELETE` là archive/soft-delete; public product API chưa được
expose cho đến khi public visibility policy được chốt.

### 5.4 User management

| ID         | Requirement                                    | Acceptance baseline                                                                            |
| ---------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| FR-USER-01 | Admin/operator xem user list/detail theo quyền | Có pagination/filter phù hợp; không expose passwordHash/token/secret                           |
| FR-USER-02 | Tạo user                                       | Validate email/password/status; hash password server-side; assign role transactionally nếu cần |
| FR-USER-03 | Cập nhật user và status                        | Có authorization; state transition hợp lệ; không cho user tự nâng quyền ngoài policy           |
| FR-USER-04 | Assign role                                    | Kiểm tra target role và actor permission; auditability là TBD                                  |

### 5.5 Role và permission management

| ID         | Requirement              | Acceptance baseline                                                       |
| ---------- | ------------------------ | ------------------------------------------------------------------------- |
| FR-RBAC-01 | Xem role/permission      | Dữ liệu hệ thống có list/detail và permission check                       |
| FR-RBAC-02 | Tạo/cập nhật role        | Code/name uniqueness; validate; không làm mất authorization integrity     |
| FR-RBAC-03 | Xóa role                 | Có conflict/protection policy; system role deletion cần quyết định        |
| FR-RBAC-04 | Assign permissions       | Transactional update; backend enforce; stale client state được invalidate |
| FR-RBAC-05 | Permission extensibility | Không hard-code toàn bộ permission list trong frontend                    |

### 5.6 Public SEO content

| ID        | Requirement            | Acceptance baseline                                                                                    |
| --------- | ---------------------- | ------------------------------------------------------------------------------------------------------ |
| FR-SEO-01 | Public pages indexable | Server Component/SSR/SSG/ISR phù hợp; semantic HTML                                                    |
| FR-SEO-02 | Metadata theo page     | title, description, canonical, Open Graph, Twitter khi phù hợp; dynamic page dùng `generateMetadata()` |
| FR-SEO-03 | Crawl controls         | Có `sitemap.ts`, `robots.ts`; private dashboard `noindex`                                              |
| FR-SEO-04 | Structured data        | Chỉ render JSON-LD phản ánh đúng nội dung thực tế                                                      |
| FR-SEO-05 | Internal linking       | Public IA có link crawlable; exact routes và taxonomy TBD                                              |

Public route candidates (`/`, `/features`, `/pricing`, `/about`, `/contact`, `/blog`, `/docs`) là khả năng mở rộng từ master prompt, không phải toàn bộ route bắt buộc trước product sign-off.

### 5.7 Backend API implementation baseline

P05 đã triển khai các private, permission-gated Route Handler sau:

| Resource   | Methods                                                               | Authorization baseline              |
| ---------- | --------------------------------------------------------------------- | ----------------------------------- |
| Product    | `GET/POST /api/v1/products`; `GET/PATCH/DELETE /api/v1/products/[id]` | `PRODUCT_VIEW/CREATE/UPDATE/DELETE` |
| User       | `GET/POST /api/v1/users`; `GET/PATCH/DELETE /api/v1/users/[id]`       | `USER_VIEW/CREATE/UPDATE/DELETE`    |
| Role       | `GET/POST /api/v1/roles`; `GET/PATCH/DELETE /api/v1/roles/[id]`       | `ROLE_VIEW/CREATE/UPDATE/DELETE`    |
| Permission | `GET /api/v1/permissions`; `GET /api/v1/permissions/[id]`             | `PERMISSION_VIEW`                   |

Mutation body được validate lại ở backend bằng Zod. List query có `page`/`pageSize` (mặc định `1/20`,
tối đa `100`), `search`, resource filters và `sortBy`/`sortOrder` whitelist. Response thành công dùng
`{ success: true, data, meta? }`; lỗi dùng flat contract với `code`, safe `message`, optional `errors`,
`traceId`, `timestamp`, `path`. User/role response chỉ dùng public fields; `password`, `passwordHash`,
token và secret không được serialize.

## 6. API và interaction requirements

### 6.1 Route baseline

```text
/api/v1/auth/login
/api/v1/auth/logout
/api/v1/auth/me
/api/v1/products
/api/v1/products/[id]
/api/v1/users
/api/v1/users/[id]
/api/v1/roles
/api/v1/roles/[id]
/api/v1/permissions
/api/health
```

Refresh auth route, public product API và các endpoint assign/status cụ thể phụ thuộc quyết định domain/session.

### 6.2 Query và response contract

List endpoint hỗ trợ contract chuẩn hóa:

```text
page, pageSize, sortBy, sortOrder, search, filter
```

`sortBy`, `sortOrder` và filter fields phải whitelist. P05 dùng `page=1`, `pageSize=20` mặc định và giới
hạn `pageSize` tối đa `100`; `sortOrder` chỉ nhận `asc|desc`. Success list gồm `data` và `meta`
(`page`, `pageSize`, `total`, `totalPages`). Error gồm `success: false`, stable `code`, safe `message`,
optional field `errors`, `traceId`, `timestamp`, `path`; không trả stack trace, SQL, internal path, secret
hoặc credential.

Master prompt liệt kê query key generic `filter` nhưng chưa quy định encoding hoặc grammar. P05 không
nhận filter tự do; thay vào đó dùng các field filter typed và whitelist theo resource (`status`,
`visibility`). Cần chốt format `filter` generic trước khi client cần filter đa trường hoặc filter động.

### 6.3 UX states

Mọi data screen phải có success, loading, empty và error. Private screen phải phân biệt 401, 403 và 404; mutation phải có disabled/loading state, validation mapping và success feedback.

## 7. Non-functional requirements

### 7.1 Security

- Backend validation bằng Zod là bắt buộc; client validation chỉ hỗ trợ UX.
- Hash password bằng Argon2id ưu tiên; cookie/session secrets lấy từ environment.
- Không lưu token nhạy cảm trong `localStorage`/`sessionStorage`.
- Không log password, token, cookie, secret hoặc API key.
- Security headers gồm CSP cân nhắc an toàn, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, HSTS khi HTTPS production sẵn sàng.
- Rate limiting cho login, refresh/forgot-password nếu có và public API; P03 dùng Redis distributed,
  fail-closed khi Redis không khả dụng, với login limit 5 attempts/60 giây.
- Generic auth error, centralized error mapping và no internal stack trace exposure.

### 7.2 SEO và performance

- Public SEO content server-rendered với Server Components mặc định.
- Dashboard/private pages không index.
- Hạn chế JavaScript client, tránh server gọi HTTP vào API nội bộ khi service trực tiếp phù hợp.
- Pagination và query design tránh N+1; caching phân biệt database/Redis/Next.js/browser/CDN và public/private data.
- Core Web Vitals là mục tiêu release; ngưỡng định lượng và device/network profile cần được chốt trước performance review.

### 7.3 Reliability và maintainability

- Strict TypeScript, ESLint, Prettier; không dùng `any`/`@ts-ignore` để che lỗi tùy tiện.
- Structured logs có timestamp, level, requestId/traceId, route, status, duration, errorCode; không có secret.
- Health endpoint kiểm tra app và dependency phù hợp mà không leak infra secret.
- Transaction cho multi-step invariant; unique constraint/idempotency cho duplicate/race condition.
- Feature-based code, server/client boundary rõ, API client tập trung, không import Prisma/server secret vào client.

### 7.4 Accessibility và responsive

Semantic HTML, heading hierarchy, form labels, keyboard navigation, focus state, accessible names/ARIA khi cần, contrast phù hợp; dashboard và public pages hoạt động trên desktop/tablet/mobile.

### 7.5 Quality gates

Trước khi một phase implementation được đánh dấu DONE: lint, typecheck, test và build phải pass theo command thực tế trong `package.json`; E2E chạy khi scope/environment yêu cầu; documentation, task và progress phải cập nhật.

## 8. Constraints và technical decisions

| Hạng mục          | Requirement/decision                                           |
| ----------------- | -------------------------------------------------------------- |
| Architecture      | Next.js Fullstack, App Router, Modular Monolith                |
| Persistence       | MySQL 8 + Prisma; không tự đổi DB                              |
| Cache/infra       | Redis, không thay nguồn dữ liệu chính                          |
| UI/data/form      | Ant Design + TanStack Query + React Hook Form + Zod            |
| Test              | Vitest + Testing Library + Playwright                          |
| Package manager   | pnpm, lockfile phải được commit khi project được khởi tạo      |
| Public rendering  | Server Component mặc định, SEO-first                           |
| Private rendering | Server Component mặc định, noindex                             |
| API               | Versioned `/api/v1`, centralized response/error                |
| Scope discipline  | Không overengineer; capability ngoài MVP cần requirement riêng |

## 9. Assumptions, unresolved requirements và impact

| ID       | Unresolved item                     | Assumption hiện tại                                                              | Phase cần xử lý | Impact                                  |
| -------- | ----------------------------------- | -------------------------------------------------------------------------------- | --------------- | --------------------------------------- |
| PR-OQ-01 | Tên/brand/domain                    | Giữ `[PROJECT_NAME]`                                                             | P00/P01         | Package, metadata, canonical, deploy    |
| PR-OQ-02 | Business/product proposition        | Catalog management foundation                                                    | P00 trước P01   | Có thể đổi entity, audience, IA         |
| PR-OQ-03 | Product schema/status/visibility    | P02/P05 provisional baseline đã encode; sign-off business còn mở                 | P07/P12         | DB, API, form, SEO                      |
| PR-OQ-04 | Role matrix và system-role policy   | Admin/User seed; matrix tối thiểu ở mục 3.1                                      | P06/P08         | Authz, UI, E2E                          |
| PR-OQ-05 | Session strategy                    | P03: opaque DB session 8 giờ; cookie-only; không refresh pair trong web-only MVP | P03/P09         | DB, Redis, rotation nếu external client |
| PR-OQ-06 | Public route/taxonomy               | Dùng candidate routes làm placeholder                                            | P06/P07         | Sitemap, metadata, content model        |
| PR-OQ-07 | SLO, traffic, compliance, retention | Chưa có quantitative target                                                      | P09/P10/P12     | Security/performance/ops                |

Requirement nào thay đổi các mục trên phải cập nhật tài liệu này, overview, task và `PROGRESS.md` trước khi implementation phụ thuộc vào nó tiếp tục.

## 10. MVP acceptance checklist

MVP chỉ được xem là product-ready khi tất cả mục sau được xác nhận theo scope thực tế:

- [ ] Product name, audience, proposition và public/private boundary đã được product owner sign-off.
- [ ] Product schema, status, visibility, slug/identifier và lifecycle đã được product owner sign-off (P02 provisional baseline đã encode).
- [x] Login/logout/me và session security đã test trong P03 unit/route/runtime smoke scope.
- [ ] RBAC matrix và 401/403 behavior đã test đầy đủ ở backend và E2E (P04 đã có backend/unit/runtime,
      E2E chờ dashboard/API mutation ở P08).
- [x] Product CRUD, validation, duplicate/not-found, pagination, sorting và filtering đã test ở route/runtime scope; E2E còn chờ P08.
- [x] User/role/permission management enforce quyền và không expose secret fields ở API/runtime scope.
- [x] API response/error contract và traceability nhất quán ở API runtime scope.
- [ ] Public pages có metadata/canonical/social cards/sitemap/robots/structured data phù hợp; dashboard noindex.
- [x] Loading/empty/error/unauthorized/forbidden/not-found và responsive/accessibility baseline đã review ở implementation baseline P06; browser E2E vẫn thuộc P08.
- [ ] Lint, typecheck, tests, build, Docker/CI verification pass theo scope.
- [ ] Security, performance, backup/operational requirements đã có owner và evidence.

## 11. Traceability với Project Overview

- Product definition, scope và open questions ở đây phải khớp mục 2, 4 và 12 của `docs/00_PROJECT_OVERVIEW.md`.
- Kiến trúc, stack, NFR và phase dependency chi tiết được định nghĩa ở `docs/00_PROJECT_OVERVIEW.md`; P05 implementation details nằm ở `docs/tasks/PHASE-05-BACKEND-API.md`.
- Không có requirement nào trong tài liệu này được hiểu là đã implemented khi repository chưa có code; trạng thái implementation theo dõi ở `docs/PROGRESS.md`.
