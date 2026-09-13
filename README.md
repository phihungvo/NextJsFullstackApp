# Next.js Fullstack App

Foundation repository for a Next.js Fullstack Modular Monolith. The product name and business
proposition are still provisional; see the discovery documents before adding domain behavior.

## Stack

- Next.js App Router + React + TypeScript strict
- pnpm
- Ant Design, TanStack Query, React Hook Form and Zod (UI integrations remain in P06)
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

Current test scope covers auth, authorization, API response/error contract and API route behavior.
Component/E2E coverage, Docker, CI/CD and formal security review remain in later phases. Do not treat
the current baseline as production-ready.

## Documentation

- `docs/00_PROJECT_OVERVIEW.md` — discovery, architecture and constraints
- `docs/01_PRODUCT_REQUIREMENTS.md` — product scope and requirements
- `docs/PROGRESS.md` — phase/task progress
- `docs/tasks/PHASE-00-DISCOVERY.md` — completed discovery task register
- `docs/tasks/PHASE-05-BACKEND-API.md` — completed backend API task register
