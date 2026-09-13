# syntax=docker/dockerfile:1.7

FROM node:22-bookworm-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="${PNPM_HOME}:${PATH}"
ENV NEXT_TELEMETRY_DISABLED="1"
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@12.4.1 --activate

FROM base AS deps

# argon2 can use a prebuilt binary, but keeping the toolchain here makes installs
# reproducible when a platform-specific prebuild is unavailable.
RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl python3 make g++ \
  && rm -rf /var/lib/apt/lists/*

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml prisma.config.ts ./
COPY prisma ./prisma

# Prisma generate does not connect to MySQL. This placeholder only gives the
# Prisma config a valid URL during image dependency installation.
ENV DATABASE_URL="mysql://app_user:app_password@mysql:3306/app_db"
RUN pnpm install --frozen-lockfile

FROM deps AS development

COPY . .
ENV NODE_ENV="development"
EXPOSE 3000
CMD ["pnpm", "dev"]

FROM deps AS builder

COPY . .
ENV NODE_ENV="production"
# Route handlers import the validated environment during Next's build-time
# configuration collection. These are build-only placeholders; Compose injects
# the real runtime values into the runner container.
ENV NEXT_PUBLIC_APP_URL="http://localhost:3000"
ENV REDIS_URL="redis://redis:6379"
ENV AUTH_SECRET="docker-build-only-secret-change-at-runtime-123456"
RUN pnpm build

FROM deps AS migrator

COPY . .
ENV NODE_ENV="production"
CMD ["pnpm", "db:deploy"]

FROM node:22-bookworm-slim AS runner

ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED="1"
ENV HOSTNAME="0.0.0.0"
ENV PORT="3000"
WORKDIR /app

RUN groupadd --system --gid 1001 nodejs \
  && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
