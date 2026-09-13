# Next.js Fullstack App

Foundation repository for a Next.js Fullstack Modular Monolith. The product name and business
proposition are still provisional; see the discovery documents before adding domain behavior.

## Stack

- Next.js App Router + React + TypeScript strict
- pnpm
- Semantic HTML/CSS UI baseline in P06; Ant Design, TanStack Query and React Hook Form remain target integrations
- Prisma + MySQL 8 and Redis
- Vitest (auth/authz/API tests); Testing Library and Playwright remain for later phases

## Development

```bash
pnpm install
pnpm dev
```

## Verification

```bash
pnpm lint
pnpm typecheck
pnpm format:check
pnpm build
```

Current test scope covers auth, authorization, API response/error contract and API route behavior; P06
adds the verified frontend route/UI baseline. Component/E2E coverage, CI/CD and formal security review
remain in later phases. Do not treat the current baseline as production-ready.

## Docker

Development với hot reload, MySQL, Redis, migration và seed:

```bash
npm run docker:dev
npm run docker:dev:seed
```

Production-like standalone image:

```bash
cp docker/.env.prod.example docker/.env.prod
# thay credential/URL trong docker/.env.prod
npm run docker:prod
```

Chi tiết kiến trúc, volume, healthcheck, migration và vận hành: `docs/09_DOCKER_DEPLOYMENT.md`.

## Documentation

- `docs/00_PROJECT_OVERVIEW.md` — discovery, architecture and constraints
- `docs/01_PRODUCT_REQUIREMENTS.md` — product scope and requirements
- `docs/PROGRESS.md` — phase/task progress
- `docs/tasks/PHASE-00-DISCOVERY.md` — completed discovery task register
- `docs/tasks/PHASE-05-BACKEND-API.md` — completed backend API task register
- `docs/tasks/PHASE-06-FRONTEND.md` — completed frontend task register
- `docs/tasks/PHASE-10-DOCKER.md` — completed Docker task register
