# Database infrastructure

Server-only database client/configuration boundary. Prisma 7 dùng `prisma.config.ts`, schema ở
`prisma/schema.prisma` và generated client ở `src/generated/prisma`.

`prisma.ts` là singleton boundary cho server code; không import database client vào Client Component.
Schema/migration/seed hiện có `User`, `Role`, `Permission`, `Product` và infrastructure `Session` theo
provisional baseline của P02/P03. Không gọi Prisma trực tiếp từ UI; flow bắt buộc là route/service →
repository → Prisma. Authorization queries phải đi qua server authorization service.
