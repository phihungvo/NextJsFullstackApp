# PHASE 00 — DISCOVERY & PROJECT DEFINITION

## Mục tiêu

Hiểu repository hiện tại, xác định product/architecture baseline và tạo source of truth trước khi viết application code.

## Dependencies

- `docs/AI_MASTER_PROMPT.md` — đã đọc toàn bộ.
- `docs/AI_START_PROMPT.md` — đã đọc toàn bộ.
- Business brief/product owner input — **chưa có**, được ghi thành open questions.

## Tasks

### P00-T01 — Kiểm tra cấu trúc repository

Status: DONE

#### Subtasks

- [x] P00-T01-S01 — Liệt kê toàn bộ file hiện hữu.
- [x] P00-T01-S02 — Kiểm tra các path application/infra bắt buộc.
- [x] P00-T01-S03 — Ghi nhận path `NOT FOUND` thay vì suy đoán.

#### Acceptance Criteria

- [x] Repository structure được ghi trong `docs/00_PROJECT_OVERVIEW.md`.
- [x] Không có application code nào được tạo trong Phase 00.

#### Verification

- [x] Filesystem audit.
- [x] Documentation review.

#### Notes

Workspace hiện chỉ có `docs/AI_MASTER_PROMPT.md` và `docs/AI_START_PROMPT.md`.

### P00-T02 — Kiểm tra package.json

Status: DONE

#### Subtasks

- [x] P00-T02-S01 — Kiểm tra `package.json`.
- [x] P00-T02-S02 — Ghi nhận package manifest chưa tồn tại.

#### Acceptance Criteria

- [x] Không tuyên bố dependency/script đã tồn tại khi chưa có file.
- [x] Target package manager và stack được ghi rõ ở overview/requirements.

#### Verification

- [x] Path existence check.

#### Notes

`package.json` là TODO của P01, không phải output của P00.

### P00-T03 — Kiểm tra Next.js version

Status: DONE

#### Subtasks

- [x] P00-T03-S01 — Kiểm tra package manifest/config.
- [x] P00-T03-S02 — Ghi nhận version chưa tồn tại.

#### Acceptance Criteria

- [x] Không tự chốt version cũ hoặc tạo package ở discovery.
- [x] Ghi target stable version tại thời điểm foundation.

#### Verification

- [x] Repository audit.

#### Notes

Version cụ thể sẽ được chọn ở P01-T01 và phải được kiểm tra compatibility.

### P00-T04 — Kiểm tra TypeScript configuration

Status: DONE

#### Subtasks

- [x] P00-T04-S01 — Kiểm tra `tsconfig`.
- [x] P00-T04-S02 — Ghi nhận TypeScript config chưa tồn tại.

#### Acceptance Criteria

- [x] Target strict mode được ghi trong product/architecture baseline.

#### Verification

- [x] Path existence check.

### P00-T05 — Kiểm tra database configuration

Status: DONE

#### Subtasks

- [x] P00-T05-S01 — Kiểm tra `prisma/` và database config.
- [x] P00-T05-S02 — Ghi nhận schema/migration/seed chưa tồn tại.

#### Acceptance Criteria

- [x] MySQL 8 + Prisma target được ghi rõ.
- [x] Không giả vờ đã có schema hoặc migration.

#### Verification

- [x] Path existence check.

### P00-T06 — Kiểm tra environment

Status: DONE

#### Subtasks

- [x] P00-T06-S01 — Kiểm tra `.env.example`.
- [x] P00-T06-S02 — Ghi nhận environment contract chưa tồn tại.

#### Acceptance Criteria

- [x] Secret management constraints được ghi rõ.

#### Verification

- [x] Path existence check.

### P00-T07 — Kiểm tra existing features

Status: DONE

#### Subtasks

- [x] P00-T07-S01 — Rà soát source/public/tests.
- [x] P00-T07-S02 — Ghi nhận chưa có feature implementation.

#### Acceptance Criteria

- [x] MVP feature baseline được xác định mà không claim implementation.

#### Verification

- [x] Full repository file audit.

### P00-T08 — Kiểm tra architecture hiện tại

Status: DONE

#### Subtasks

- [x] P00-T08-S01 — Đối chiếu repository với target architecture.
- [x] P00-T08-S02 — Ghi nhận current/target difference và impact.

#### Acceptance Criteria

- [x] Target Modular Monolith, layer boundary và SEO-first rule được ghi rõ.
- [x] Không rewrite/scaffold application ở P00.

#### Verification

- [x] Architecture review.

### P00-T09 — Xác định technical debt

Status: DONE

#### Subtasks

- [x] P00-T09-S01 — Liệt kê missing foundation và tài liệu master issue.
- [x] P00-T09-S02 — Ghi impact và hướng xử lý.

#### Acceptance Criteria

- [x] Technical debt/risk có severity, impact và next action.

#### Verification

- [x] Risk review.

### P00-T10 — Đề xuất implementation plan

Status: DONE

#### Subtasks

- [x] P00-T10-S01 — Xác định product baseline, scope và open questions.
- [x] P00-T10-S02 — Xác định phase dependency.
- [x] P00-T10-S03 — Cập nhật progress và đề xuất task tiếp theo.

#### Acceptance Criteria

- [x] `00_PROJECT_OVERVIEW.md` và `01_PRODUCT_REQUIREMENTS.md` nhất quán.
- [x] Open questions không bị silently resolved.
- [x] `PROGRESS.md` phản ánh đúng trạng thái docs-only.

#### Verification

- [x] Cross-document consistency review.
- [x] Link/path and terminology review.

## Phase verification

- Application lint/typecheck/test/build: **NOT APPLICABLE** — chưa có `package.json` hoặc application code.
- Documentation consistency: **PASS** — kiểm tra thủ công giữa overview, requirements, task và progress.
- Discovery acceptance: **PASS** — repository state, target architecture, product baseline, constraints, risks và open questions đã được ghi nhận.
- Master prompt path discrepancy: **RECORDED** — `docs/PROGRESS.md` được chọn theo workflow chi tiết, `AI_START_PROMPT.md` và user request; không tạo duplicate `docs/15_PROGRESS.md`.

## Notes

- Phase này không tạo code application.
- `DONE` ở đây chỉ có nghĩa là discovery/documentation tasks đã hoàn thành; không có nghĩa project đã production-ready.
- Các quyết định provisional phải được product owner/technical owner xác nhận trước khi các phase phụ thuộc khóa implementation.
