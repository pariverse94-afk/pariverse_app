# ── Stage 1: build ───────────────────────────────────────────────────────────
FROM node:22-alpine AS builder

# pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests first (better layer caching)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json tsconfig.json ./

# Copy only the packages that the API server needs
COPY lib/db/package.json           ./lib/db/
COPY lib/db/tsconfig.json          ./lib/db/
COPY lib/api-zod/package.json      ./lib/api-zod/
COPY lib/api-zod/tsconfig.json     ./lib/api-zod/
COPY artifacts/api-server/package.json      ./artifacts/api-server/
COPY artifacts/api-server/tsconfig.json     ./artifacts/api-server/

RUN pnpm install --frozen-lockfile --filter @workspace/api-server...

# Copy source
COPY lib/db/src                    ./lib/db/src/
COPY lib/api-zod/src               ./lib/api-zod/src/
COPY artifacts/api-server/src      ./artifacts/api-server/src/
COPY artifacts/api-server/build.mjs ./artifacts/api-server/

# Build shared libs then the API server
RUN pnpm run typecheck:libs
RUN pnpm --filter @workspace/api-server run build

# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM node:22-alpine AS runner

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /app

# Copy workspace manifests (for pnpm install --prod)
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY lib/db/package.json           ./lib/db/
COPY lib/api-zod/package.json      ./lib/api-zod/
COPY artifacts/api-server/package.json ./artifacts/api-server/

RUN pnpm install --frozen-lockfile --prod --filter @workspace/api-server...

# Copy compiled output from builder
COPY --from=builder /app/artifacts/api-server/dist ./artifacts/api-server/dist

ENV NODE_ENV=production
ENV PORT=8080

# Cloud Run sends traffic to PORT 8080
EXPOSE 8080

CMD ["node", "--enable-source-maps", "/app/artifacts/api-server/dist/index.mjs"]
