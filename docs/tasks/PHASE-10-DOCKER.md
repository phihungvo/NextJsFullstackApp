# PHASE 10 — DOCKER

## Mục tiêu

Đóng gói toàn bộ Next.js Fullstack application thành quy trình Docker dễ chạy cho development và
production-like deployment: app, MySQL, Redis, migration, seed, healthcheck, persistent volume, secret
boundary và non-root standalone runtime.

## Task register

| Task    | Phạm vi                                                                     | Trạng thái |
| ------- | --------------------------------------------------------------------------- | ---------- |
| P10-T01 | Multi-stage `Dockerfile` với `development`, `builder`, `migrator`, `runner` | DONE       |
| P10-T02 | Dependency install reproducible bằng Corepack + pnpm 12.4.1                 | DONE       |
| P10-T03 | Next standalone output và production runner                                 | DONE       |
| P10-T04 | Development Compose với hot reload và source bind mount                     | DONE       |
| P10-T05 | MySQL 8.4, credentials/env contract và persistent volume                    | DONE       |
| P10-T06 | Redis 7.4, AOF persistence và persistent volume                             | DONE       |
| P10-T07 | MySQL/Redis/app healthchecks và dependency conditions                       | DONE       |
| P10-T08 | Migration service riêng, development seed profile và internal network       | DONE       |
| P10-T09 | Production build, non-root image, runtime smoke và documentation            | DONE       |
| P10-T10 | IntelliJ một nút: Compose development, Node Inspector và backend breakpoint | DONE       |

## Thiết kế môi trường

### Development

`docker-compose.yml` chạy:

- `app`: Next dev/Turbopack, source bind mount, named volume cho `node_modules`, `.next` và generated
  Prisma client.
- `mysql`: `mysql:8.4`, host port `3307` để tránh đụng MySQL local mặc định.
- `redis`: `redis:7.4-alpine`, host port `6380`.
- `migrate`: chạy `prisma migrate deploy` sau khi MySQL healthy.
- `seed`: profile `tools`, chỉ chạy khi gọi explicit.

### Production-like

`docker-compose.prod.yml` chạy app standalone từ `runner`, migration trước app, MySQL/Redis chỉ ở network
nội bộ, named volume dữ liệu và không có seed service. Production thật vẫn cần reverse proxy/TLS, backup,
secret manager và monitoring.

## Acceptance checklist

- [x] Có `.dockerignore`, `Dockerfile`, development Compose và production Compose.
- [x] Không copy `.env`/production secret vào image; runtime env được inject qua Compose.
- [x] Next output `standalone`, runner dùng user `nextjs` non-root.
- [x] MySQL, Redis và app có healthcheck phù hợp.
- [x] Migration dùng `prisma migrate deploy`; seed bị giới hạn development.
- [x] Development hot reload giữ source mount nhưng không làm bẩn host bằng dependency/build cache.
- [x] Có named volumes cho development và production data.
- [x] Có env examples và hướng dẫn vận hành rõ ràng.
- [x] IntelliJ shared run configuration tuần tự khởi động Compose, chờ Node Inspector và attach backend.

## Verification evidence

Đã verify thực tế trên Docker Desktop ARM64:

```text
docker compose ... config                 PASS — dev và prod
docker compose ... build app migrate      PASS — development image
docker compose ... build app migrate      PASS — production standalone + migrator
docker compose ... up -d                  PASS
MySQL healthcheck                         healthy
Redis healthcheck                         healthy
prisma migrate deploy                     PASS — 2 migrations applied
prisma db seed                             PASS — 2 users, 2 products
app healthcheck                            healthy
GET /api/health                            HTTP 200
POST /api/v1/auth/login                    HTTP 200
GET /api/v1/auth/me                        HTTP 200
GET /api/v1/products                       HTTP 200
pnpm docker:debug:backend                  PASS — Inspector target at 127.0.0.1:9229
Next.js Docker - Debug Backend             READY — shared IntelliJ attach config with /app mapping
```

## Lệnh chính

```bash
npm run docker:dev
npm run docker:dev:seed
npm run docker:dev:logs
npm run docker:dev:down

cp docker/.env.prod.example docker/.env.prod
npm run docker:prod
npm run docker:prod:down
```

Chi tiết vận hành và cảnh báo volume/secret: `docs/09_DOCKER_DEPLOYMENT.md`.
