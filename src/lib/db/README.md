# Database infrastructure

Server-only database client/configuration boundary. Prisma 7 dùng `prisma.config.ts`, schema ở
`prisma/schema.prisma` và generated client ở `src/generated/prisma`.

`prisma.ts` là singleton boundary cho server code; không import database client vào Client Component.
Chưa có model, migration hoặc seed vì Product/User/Role/Permission schema còn phụ thuộc product
decision. Không gọi Prisma trực tiếp từ UI; flow bắt buộc là route/service → repository → Prisma.
