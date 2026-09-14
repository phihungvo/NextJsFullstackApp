# PHASE 07 — SEO

## Mục tiêu

Hoàn thiện technical SEO cho public surface đã được xác nhận mà không tự chốt public taxonomy hoặc product
detail route khi product proposition vẫn provisional. Private/authenticated routes phải không được index.

## Phạm vi đã chốt

Public route chắc chắn hiện tại là `/`. Các candidate route như `/features`, `/pricing`, `/about`, `/blog`
và public product detail vẫn là open decision; vì vậy chưa đưa vào sitemap hoặc tạo nội dung giả.

## Task register

| Task    | Phạm vi                                                                       | Trạng thái | Approval      |
| ------- | ----------------------------------------------------------------------------- | ---------- | ------------- |
| P07-T01 | Global site identity, `metadataBase`, title template, language và description | DONE       | AUTO-APPROVED |
| P07-T02 | Public home metadata, canonical, Open Graph và Twitter Card                   | DONE       | AUTO-APPROVED |
| P07-T03 | JSON-LD `WebSite` phản ánh đúng public home                                   | DONE       | AUTO-APPROVED |
| P07-T04 | `sitemap.ts` chỉ publish public route đã xác nhận                             | DONE       | AUTO-APPROVED |
| P07-T05 | `robots.ts` với sitemap và disallow cho API/private routes                    | DONE       | AUTO-APPROVED |
| P07-T06 | Auth/dashboard `noindex` và `nofollow` boundary                               | DONE       | AUTO-APPROVED |
| P07-T07 | SEO tests, build/runtime verification và documentation                        | DONE       | AUTO-APPROVED |

## Quyết định triển khai

- Metadata dùng Next Metadata API và `NEXT_PUBLIC_APP_URL`; local fallback là `http://localhost:3000`.
- Canonical hiện chỉ trỏ về `/`, đúng với public route đã confirmed.
- Sitemap không đưa `/login`, `/dashboard`, `/api` hoặc product route private vào danh sách crawl.
- `robots.txt` là crawl guidance, không phải security boundary; authentication/authorization vẫn do server
  enforce.
- JSON-LD chỉ dùng `WebSite`, không thêm `Product`, `Organization` hoặc review data khi chưa có nội dung
  public/business data tương ứng.

## Acceptance checklist

- [x] Root metadata có `metadataBase`, title template và description; public home có canonical, Open Graph và Twitter Card.
- [x] Public home có page-specific metadata và JSON-LD server-rendered.
- [x] Có sitemap hợp lệ cho public route đã xác nhận.
- [x] Có robots rules cho sitemap, API và private/auth routes.
- [x] Auth layout và dashboard layout giữ `noindex, nofollow`.
- [x] Không tạo public taxonomy hoặc structured data vượt quá dữ liệu thực tế.
- [x] SEO unit tests, lint, typecheck, test suite, build và runtime smoke pass.
- [x] Task register, progress, requirements và overview đã cập nhật.

## Residual scope

Product owner vẫn cần chốt tên/domain chính thức, public information architecture, public product detail,
content taxonomy, social image assets và structured data chi tiết trước production SEO launch. Khi các route
đó được chốt, cần bổ sung `sitemap` entries, page-level metadata và JSON-LD tương ứng.
