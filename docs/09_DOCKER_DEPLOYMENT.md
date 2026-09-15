# Docker và triển khai

## Phạm vi

Repo có hai Compose profile tách biệt:

- `docker-compose.yml`: development, hot reload, bind mount source, MySQL 8.4, Redis 7.4, migration
  tự động và seed thủ công.
- `docker-compose.prod.yml`: production-like, Next.js standalone multi-stage image, non-root runtime,
  migration service riêng, volume dữ liệu và chỉ publish app port.

Các service dùng network nội bộ của Compose. Trong production, MySQL và Redis không publish port ra host.

## Chạy development

Yêu cầu Docker Desktop đang chạy:

```bash
npm run docker:dev
```

Lệnh trên build image development, khởi động MySQL/Redis, chờ healthcheck, chạy `prisma migrate deploy`
và mở Next dev server tại `http://localhost:3000`.

Trong terminal khác, seed dữ liệu development:

```bash
npm run docker:dev:seed
```

Tài khoản development được lấy từ `docker/.env.dev.example`. Có thể copy file thành `docker/.env.dev`
và chỉnh các biến khi cần, sau đó chạy Compose với:

```bash
docker compose --env-file docker/.env.dev -f docker-compose.yml up --build
```

Các lệnh thường dùng:

```bash
npm run docker:dev:logs
npm run docker:dev:down
docker compose --env-file docker/.env.dev.example -f docker-compose.yml ps
```

Development host ports:

| Service        |   Host | Container |
| -------------- | -----: | --------: |
| App            | `3000` |    `3000` |
| Node Inspector | `9229` |    `9229` |
| MySQL          | `3307` |    `3306` |
| Redis          | `6380` |    `6379` |

Source được mount vào `/app`; `node_modules`, `.next` và Prisma client generated dùng named volume để
không làm bẩn máy host. Migrations chạy tự động mỗi lần Compose tạo `migrate` service; seed không chạy
tự động để tránh ghi dữ liệu ngoài ý muốn.

Node Inspector chỉ publish lên `127.0.0.1`, không mở ra LAN. Để khởi động Docker và attach backend
debugger IntelliJ bằng một nút, xem `docs/10_INTELLIJ_DEBUGGING.md`.

## Production-like local run

Không dùng credential trong example cho môi trường thật. Tạo file local bị gitignore:

```bash
cp docker/.env.prod.example docker/.env.prod
```

Sau đó thay `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`, `DATABASE_URL`, `AUTH_SECRET` và
`NEXT_PUBLIC_APP_URL`. `NEXT_PUBLIC_APP_URL` được dùng ở build time để canonical/JSON-LD trong standalone
bundle trỏ đúng domain; khi đổi domain cần build lại image. Password trong `DATABASE_URL` phải URL-encode
nếu có ký tự đặc biệt.

Khởi động:

```bash
npm run docker:prod
```

Kiểm tra:

```bash
docker compose --env-file docker/.env.prod -f docker-compose.prod.yml ps
curl http://localhost:3000/api/health
npm run docker:prod:logs
```

Dừng:

```bash
npm run docker:prod:down
```

Production Compose không có seed service. Seed chỉ dành cho development; không chạy `prisma db seed`
trên production vì `prisma/seed.ts` chủ động từ chối `NODE_ENV=production`.

## Image design

`Dockerfile` có các stage:

1. `deps`: Node 22, Corepack/pnpm 12.4.1, dependency install và Prisma generate.
2. `development`: source image cho Compose hot reload.
3. `builder`: production Next build.
4. `migrator`: có Prisma CLI/migrations để chạy `prisma migrate deploy`.
5. `runner`: chỉ chứa `.next/standalone`, static assets và user `nextjs` non-root.

Runtime app không chạy migration trong process web. Compose đảm bảo `migrate` hoàn tất thành công trước
khi start `app`, tránh race condition lúc deploy.

## Vận hành dữ liệu

`docker compose down` giữ named volumes. Chỉ xóa dữ liệu development khi thực sự cần reset:

```bash
docker compose --env-file docker/.env.dev.example -f docker-compose.yml down -v
```

Không dùng `-v` trên production nếu chưa có backup/khôi phục được dữ liệu. Production cần reverse proxy,
TLS, backup MySQL, secret manager và log/monitoring bên ngoài Compose trước khi public Internet.

## Verification

- `docker compose ... config` phải parse không lỗi.
- `docker compose ... build` phải hoàn tất `deps`, `builder`, `migrator`, `runner`.
- App healthcheck gọi `/api/health`.
- MySQL/Redis healthcheck phải healthy trước migration/app.
- Migration dùng `prisma migrate deploy`, không dùng `migrate dev` trong container deployment.
