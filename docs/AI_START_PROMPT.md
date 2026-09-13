# PROMPT — ĐỌC VÀ TUÂN THỦ AI_MASTER_PROMPT.md

Bạn đang tham gia một dự án phần mềm hiện có.

Trước khi thực hiện BẤT KỲ thay đổi code nào, bạn bắt buộc phải đọc và hiểu tài liệu:

```text
docs/AI_MASTER_PROMPT.md
```

Đây là tài liệu quy định:

* kiến trúc dự án;
* công nghệ;
* coding convention;
* security;
* SEO;
* database;
* API;
* testing;
* Docker;
* CI/CD;
* cách quản lý Phase;
* cách quản lý Task;
* cách cập nhật tiến độ;
* quy trình làm việc của AI Coding Agent.

---

# 1. QUY TẮC TUYỆT ĐỐI

Bạn KHÔNG được bắt đầu viết code ngay sau khi nhận prompt này.

Bắt buộc thực hiện:

```text
Đọc AI_MASTER_PROMPT.md
        ↓
Đọc cấu trúc repository
        ↓
Đọc documentation hiện tại
        ↓
Kiểm tra trạng thái project
        ↓
Kiểm tra PROGRESS.md
        ↓
Kiểm tra task hiện tại
        ↓
Phân tích yêu cầu
        ↓
Lập kế hoạch
        ↓
Sau đó mới được code
```

Không được bỏ qua bất kỳ bước nào.

---

# 2. FILE ƯU TIÊN CAO NHẤT

File:

```text
docs/AI_MASTER_PROMPT.md
```

là bộ quy tắc chính dành cho AI Coding Agent.

Bạn phải xem file này là:

> Source of Truth cho cách tổ chức, phát triển và quản lý dự án.

Nếu code hiện tại khác với quy định trong file, KHÔNG được tự động rewrite toàn bộ project.

Phải:

1. xác định sự khác biệt;
2. đánh giá impact;
3. xác định task cần thực hiện;
4. lập kế hoạch migration/refactor;
5. sau đó mới thay đổi.

---

# 3. SAU KHI ĐỌC FILE

Sau khi đọc xong `docs/AI_MASTER_PROMPT.md`, hãy kiểm tra toàn bộ repository.

Ít nhất phải kiểm tra:

```text
package.json
src/
prisma/
public/
tests/
docs/
Dockerfile
docker-compose.yml
.env.example
.github/
```

Nếu một thư mục/file không tồn tại thì ghi nhận là:

```text
NOT FOUND
```

Không tự suy đoán rằng nó đã tồn tại.

---

# 4. ĐỌC DOCUMENTATION

Kiểm tra:

```text
docs/
```

Đặc biệt tìm:

```text
docs/AI_MASTER_PROMPT.md

docs/00_PROJECT_OVERVIEW.md
docs/01_PRODUCT_REQUIREMENTS.md
docs/02_SYSTEM_ARCHITECTURE.md
docs/03_TECHNICAL_ARCHITECTURE.md
docs/04_DATABASE_DESIGN.md
docs/05_API_DOCUMENTATION.md
docs/06_SECURITY.md
docs/07_SEO.md
docs/08_DEVELOPMENT_GUIDE.md
docs/09_DOCKER_DEPLOYMENT.md
docs/10_TESTING_STRATEGY.md
docs/11_CODING_STANDARDS.md
docs/12_TASK_MANAGEMENT.md
docs/13_ROADMAP.md
docs/14_AI_AGENT_RULES.md
docs/PROGRESS.md
```

Nếu file chưa tồn tại:

* không được giả vờ rằng đã đọc;
* ghi nhận là chưa tồn tại;
* nếu file đó cần thiết cho phase hiện tại thì tạo task để bổ sung.

---

# 5. ĐỌC TASK MANAGEMENT

Kiểm tra:

```text
docs/tasks/
```

Đọc các phase/task liên quan đến công việc hiện tại.

Ví dụ:

```text
PHASE-00-DISCOVERY.md
PHASE-01-FOUNDATION.md
PHASE-02-DATABASE.md
...
```

Xác định:

```text
Phase hiện tại
Task hiện tại
Task đã hoàn thành
Task đang làm
Task bị block
Task tiếp theo
```

---

# 6. ĐỌC PROGRESS

Bắt buộc đọc:

```text
docs/PROGRESS.md
```

Xác định chính xác:

```text
Current Phase
Current Task
Completed Tasks
In Progress Tasks
Blocked Tasks
TODO Tasks
```

Không được tự chọn một task khác nếu `PROGRESS.md` đã xác định task hiện tại.

---

# 7. NẾU PROGRESS.md CHƯA TỒN TẠI

Nếu:

```text
docs/PROGRESS.md
```

chưa tồn tại:

Hãy tạo file này trước khi bắt đầu implementation.

File phải thể hiện tối thiểu:

```markdown
# TIẾN ĐỘ DỰ ÁN

## Tổng quan

## Phase hiện tại

## Task hiện tại

## Các Phase

## Tasks đã hoàn thành

## Tasks đang thực hiện

## Tasks bị Blocked

## Tasks TODO

## Quyết định kỹ thuật

## Vấn đề đang tồn tại

## Việc tiếp theo
```

Sau khi tạo xong phải tiếp tục discovery.

---

# 8. NẾU TASK HIỆN TẠI CHƯA RÕ

Không được tự ý chọn task.

Hãy:

1. phân tích project;
2. phân tích roadmap;
3. xác định dependency;
4. đề xuất task hợp lý;
5. ghi vào task management;
6. cập nhật `PROGRESS.md`.

Nếu có nhiều lựa chọn quan trọng, hãy nêu rõ trade-off trước khi implementation.

---

# 9. DISCOVERY REPORT

Sau khi đọc toàn bộ tài liệu cần thiết, chưa được code ngay.

Trước tiên phải tạo báo cáo:

```text
==================================================
PROJECT DISCOVERY REPORT
==================================================

1. Project
2. Current Architecture
3. Technology Stack
4. Repository Structure
5. Database
6. Authentication
7. Authorization
8. API
9. Frontend
10. SEO
11. Testing
12. Docker
13. CI/CD
14. Current Phase
15. Current Task
16. Completed Work
17. Remaining Work
18. Technical Debt
19. Risks
20. Recommended Next Action
```

---

# 10. KIỂM TRA STACK

Xác nhận project có đúng định hướng:

```text
Next.js
React
TypeScript
Prisma
MySQL
Redis
Ant Design
TanStack Query
React Hook Form
Zod
Vitest
Testing Library
Playwright
Docker
```

Nếu phát hiện stack khác:

KHÔNG được tự ý thay đổi ngay.

Phải báo:

```text
Current:
...

Expected:
...

Difference:
...

Impact:
...

Recommendation:
...
```

---

# 11. KIỂM TRA KIẾN TRÚC

Xác nhận architecture đang hướng tới:

```text
Next.js Fullstack
        |
        +-- Frontend
        |
        +-- Route Handlers
        |
        +-- Validation
        |
        +-- Authentication
        |
        +-- Authorization
        |
        +-- Services
        |
        +-- Repositories
        |
        +-- Prisma
        |
        +-- MySQL
```

Không đưa business logic trực tiếp vào:

```text
route.ts
page.tsx
component.tsx
```

nếu logic đó thuộc Service/Business layer.

---

# 12. KIỂM TRA SEO

Xác nhận public pages đang hướng tới:

```text
Server Components
SSR
SSG
ISR
Metadata API
generateMetadata
Sitemap
Robots
Canonical
Open Graph
Twitter Cards
JSON-LD
Semantic HTML
```

Dashboard/private pages phải được xem xét:

```text
noindex
```

Không được hy sinh SEO bằng cách biến toàn bộ website thành Client Components.

---

# 13. KIỂM TRA SECURITY

Kiểm tra:

```text
Authentication
Authorization
Cookie
Session
Password hashing
CSRF
Rate limiting
Security headers
Input validation
Secret management
SQL/ORM safety
Logging
Error handling
```

Đặc biệt kiểm tra không có:

```text
password trong response
password trong log
token trong log
secret trong source code
secret trong frontend bundle
JWT trong localStorage nếu architecture sử dụng HttpOnly Cookie
```

---

# 14. KIỂM TRA DATABASE

Kiểm tra:

```text
Prisma schema
Migration
Seed
Foreign Keys
Unique constraints
Indexes
Transactions
Relations
```

Không reset database tùy tiện.

Không sửa migration cũ đã được sử dụng ở môi trường shared/production.

---

# 15. KIỂM TRA CODE QUALITY

Kiểm tra:

```text
TypeScript strict
ESLint
Prettier
Naming
Folder structure
Import boundaries
Server/client boundaries
Duplicate code
Unused code
Any
TODO
FIXME
```

Không dùng:

```text
any
@ts-ignore
eslint-disable
```

để che lỗi một cách tùy tiện.

---

# 16. KIỂM TRA TEST

Kiểm tra:

```text
Unit Test
Component Test
Integration Test
E2E Test
```

Xác định test hiện có và test còn thiếu.

---

# 17. KIỂM TRA DOCKER

Kiểm tra:

```text
Dockerfile
docker-compose.yml
MySQL
Redis
Healthcheck
Volume
Network
Environment
Non-root container
Standalone Next.js build
```

---

# 18. SAU DISCOVERY

Sau khi hoàn thành discovery, hãy đưa ra:

```text
DISCOVERY RESULT

Project Status:
...

Current Phase:
...

Current Task:
...

Architecture Status:
GOOD / NEEDS IMPROVEMENT / BROKEN

Security Status:
GOOD / NEEDS IMPROVEMENT / BROKEN

SEO Status:
GOOD / NEEDS IMPROVEMENT / BROKEN

Testing Status:
GOOD / NEEDS IMPROVEMENT / BROKEN

Build Status:
PASS / FAIL / NOT TESTED

Main Problems:
1.
2.
3.

Recommended Next Task:
...

Reason:
...
```

---

# 19. KHÔNG ĐƯỢC CODE NẾU

Không bắt đầu implementation nếu:

* chưa đọc `AI_MASTER_PROMPT.md`;
* chưa biết current phase;
* chưa biết current task;
* chưa hiểu architecture liên quan;
* chưa kiểm tra code hiện tại;
* chưa kiểm tra dependency của task.

---

# 20. KHI BẮT ĐẦU TASK

Mỗi task phải bắt đầu bằng:

```text
TASK START REPORT
```

Format:

```text
==================================================
TASK START REPORT
==================================================

Task ID:
PXX-TXX

Task Name:
...

Objective:
...

Current Status:
TODO / IN_PROGRESS

Dependencies:
...

Relevant Files:
...

Implementation Plan:
1.
2.
3.
4.

Acceptance Criteria:
- [ ]
- [ ]
- [ ]

Testing Plan:
- [ ]
- [ ]
```

Sau đó mới được code.

---

# 21. TRONG QUÁ TRÌNH CODE

Luôn tuân thủ:

```text
AI_MASTER_PROMPT.md
```

Không tự ý:

* đổi framework;
* đổi database;
* đổi architecture;
* thêm dependency lớn;
* xóa module;
* rewrite toàn project;
* bỏ test;
* bỏ security;
* bỏ SEO requirement.

---

# 22. KHI MUỐN THAY ĐỔI ARCHITECTURE

Nếu phát hiện architecture hiện tại không phù hợp:

KHÔNG tự ý rewrite.

Phải báo:

```text
ARCHITECTURE CHANGE PROPOSAL

Current:
...

Problem:
...

Impact:
...

Proposed:
...

Benefits:
...

Risks:
...

Migration Plan:
1.
2.
3.

Affected Files:
...

Required Documentation:
...
```

Chỉ implementation khi thay đổi đã hợp lý theo requirement/project state.

---

# 23. KHI TẠO FILE MỚI

Trước khi tạo file:

Kiểm tra xem file/chức năng tương tự đã tồn tại chưa.

Không tạo:

```text
product.service.ts
product.service.new.ts
product.service.v2.ts
product.service.final.ts
```

Nếu chức năng đã tồn tại:

> mở rộng implementation hiện tại.

---

# 24. KHI SỬA CODE

Ưu tiên:

```text
Minimal Change
```

Không rewrite toàn bộ file nếu chỉ cần sửa một phần.

Không phá behavior hiện tại nếu requirement không yêu cầu.

---

# 25. SAU KHI IMPLEMENT

Bắt buộc:

```text
Code
 ↓
Typecheck
 ↓
Lint
 ↓
Unit Test
 ↓
Integration Test nếu liên quan
 ↓
E2E nếu liên quan
 ↓
Build
 ↓
Review
```

Không được bỏ qua verification chỉ vì task nhỏ.

---

# 26. NẾU TEST FAIL

Không được đánh dấu task DONE.

Phải:

```text
Analyze
 ↓
Find Root Cause
 ↓
Fix
 ↓
Run Test Again
```

Nếu chưa giải quyết được:

```text
BLOCKED
```

và ghi lý do.

---

# 27. CẬP NHẬT TASK

Sau khi hoàn thành task:

Cập nhật file phase tương ứng.

Ví dụ:

```text
docs/tasks/PHASE-03-AUTHENTICATION.md
```

Task:

```text
P03-T03
```

chuyển:

```text
TODO
```

thành:

```text
DONE
```

chỉ khi Acceptance Criteria đạt.

---

# 28. CẬP NHẬT PROGRESS

Sau mỗi task phải cập nhật:

```text
docs/PROGRESS.md
```

Cập nhật:

```text
Current Phase
Current Task
Completed Tasks
Remaining Tasks
Blocked Tasks
Technical Decisions
Known Issues
Next Task
```

Không được quên bước này.

---

# 29. KHI HOÀN THÀNH PHASE

Kiểm tra:

```text
[ ] Tất cả task DONE
[ ] Acceptance Criteria đạt
[ ] Tests PASS
[ ] Typecheck PASS
[ ] Lint PASS
[ ] Build PASS
[ ] Documentation cập nhật
[ ] PROGRESS.md cập nhật
```

Sau đó tạo:

```text
PHASE COMPLETION REPORT
```

---

# 30. FORMAT PHASE COMPLETION REPORT

```text
==================================================
PHASE COMPLETION REPORT
==================================================

Phase:
PXX

Name:
...

Status:
DONE / IN_PROGRESS / BLOCKED

Completed Tasks:
- PXX-T01
- PXX-T02
- PXX-T03

Skipped Tasks:
- None

Blocked Tasks:
- None

Files Changed:
- ...

Tests:
- Unit: PASS
- Integration: PASS
- E2E: PASS
- Typecheck: PASS
- Lint: PASS
- Build: PASS

Security Review:
...

SEO Review:
...

Documentation Updated:
...

Next Phase:
PXX
```

---

# 31. QUẢN LÝ TIẾN ĐỘ

Tiến độ phải được quản lý theo:

```text
Project
 ↓
Phase
 ↓
Task
 ↓
Subtask
 ↓
Acceptance Criteria
 ↓
Verification
 ↓
DONE
```

Không quản lý dự án chỉ bằng một TODO list đơn giản.

---

# 32. TASK ID

Mỗi task phải có ID duy nhất:

```text
P00-T01
P00-T02

P01-T01
P01-T02

P02-T01
```

Subtask:

```text
P01-T01-S01
P01-T01-S02
```

Không tạo ID trùng nhau.

---

# 33. SOURCE OF TRUTH VỀ TIẾN ĐỘ

Nếu có conflict giữa:

```text
PROGRESS.md
Task file
AI memory
```

phải ưu tiên trạng thái được xác minh bằng repository/code/test.

Không tin rằng task DONE chỉ vì file ghi DONE.

Phải kiểm tra implementation thực tế.

Nếu phát hiện discrepancy:

```text
Documentation says:
DONE

Actual code:
INCOMPLETE

Action:
Reconcile documentation with actual state.
```

---

# 34. KHÔNG ĐƯỢC BÁO CÁO SAI

Không được nói:

```text
Test passed
```

nếu chưa chạy test.

Không được nói:

```text
Build successful
```

nếu chưa build.

Không được nói:

```text
Implemented
```

nếu code chưa hoàn thành.

Không được nói:

```text
Production ready
```

nếu chưa thực sự đáp ứng tiêu chuẩn tương ứng.

---

# 35. NGUYÊN TẮC KHI KHÔNG CHẮC CHẮN

Nếu không chắc:

```text
Do not guess silently.
```

Hãy:

1. kiểm tra code;
2. kiểm tra documentation;
3. kiểm tra configuration;
4. kiểm tra dependency;
5. đưa ra assumption nếu cần;
6. ghi assumption vào documentation/task.

---

# 36. MỤC TIÊU CUỐI CÙNG

Bạn không chỉ có nhiệm vụ:

> "Viết code."

Bạn phải giúp xây dựng một project có:

```text
Architecture
+
Code
+
Database
+
API
+
Security
+
SEO
+
Testing
+
Docker
+
CI/CD
+
Documentation
+
Task Management
+
Progress Tracking
```

Mọi thay đổi phải có lý do và có thể kiểm chứng.

---

# 37. LỆNH BẮT ĐẦU

Bây giờ hãy bắt đầu bằng việc:

### BƯỚC 1

Đọc:

```text
docs/AI_MASTER_PROMPT.md
```

### BƯỚC 2

Đọc:

```text
docs/
```

### BƯỚC 3

Kiểm tra repository structure.

### BƯỚC 4

Đọc:

```text
docs/PROGRESS.md
docs/tasks/
```

### BƯỚC 5

Xác định:

```text
Current Phase
Current Task
```

### BƯỚC 6

Thực hiện Project Discovery.

### BƯỚC 7

Tạo `PROJECT DISCOVERY REPORT`.

### BƯỚC 8

KHÔNG viết code ngay.

### BƯỚC 9

Đề xuất task cần thực hiện tiếp theo.

### BƯỚC 10

Chỉ bắt đầu implementation sau khi đã hoàn thành toàn bộ discovery và xác định task rõ ràng.

---

# 38. OUTPUT ĐẦU TIÊN BẮT BUỘC

Phản hồi đầu tiên của bạn sau khi nhận prompt này phải có format:

```text
==================================================
AI PROJECT INITIALIZATION
==================================================

AI_MASTER_PROMPT:
READING

Repository:
INSPECTING

Documentation:
INSPECTING

Task Management:
INSPECTING

Progress:
INSPECTING

Current Phase:
...

Current Task:
...

Project Status:
...

Discovery Status:
IN_PROGRESS

Next Action:
PROJECT DISCOVERY
```

Sau đó mới bắt đầu quá trình discovery.

---

# 39. QUY TẮC CUỐI CÙNG

Hãy nhớ:

> Đọc trước — Hiểu sau — Lập kế hoạch — Thực hiện — Kiểm thử — Review — Cập nhật tài liệu — Cập nhật tiến độ.

Tuyệt đối không:

> Code trước — suy nghĩ sau.
