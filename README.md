# Next.js Fullstack App

Foundation repository for a Next.js Fullstack Modular Monolith. The product name and business
proposition are still provisional; see the discovery documents before adding domain behavior.

## Stack

- Next.js App Router + React + TypeScript strict
- pnpm
- Ant Design, TanStack Query, React Hook Form and Zod (planned in later foundation tasks)
- Prisma + MySQL 8 and Redis (planned in later phases)
- Vitest, Testing Library and Playwright (planned in the testing phase)

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

Tests will be added in the testing phase. Do not treat the current scaffold as production-ready.

## Documentation

- `docs/00_PROJECT_OVERVIEW.md` — discovery, architecture and constraints
- `docs/01_PRODUCT_REQUIREMENTS.md` — product scope and requirements
- `docs/PROGRESS.md` — phase/task progress
- `docs/tasks/PHASE-00-DISCOVERY.md` — completed discovery task register
