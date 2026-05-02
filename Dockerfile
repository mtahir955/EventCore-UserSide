# ============================================================================
# EVENT CORE BUSINESS FRONTEND - PRODUCTION DOCKERFILE
# ============================================================================
#
# Multi-tenant Business Frontend
# Serves: *.eventcoresolutions.com (including admin.eventcoresolutions.com)
#
# BUILD:
#   docker build -t eventcore-frontend .
#
# RUN:
#   docker run -p 3001:3000 eventcore-frontend
#
# ============================================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app
# Prefer the npm lockfile when both npm and pnpm lockfiles are committed.
COPY package.json package-lock.json* pnpm-lock.yaml* ./
RUN --mount=type=cache,target=/root/.npm \
  set -eux; \
  install_cmd=""; \
  if [ -f package-lock.json ]; then \
    install_cmd="npm ci --fetch-retries=5 --fetch-retry-mintimeout=10000 --fetch-retry-maxtimeout=120000 --fetch-timeout=300000"; \
  elif [ -f pnpm-lock.yaml ]; then \
    corepack enable pnpm; \
    install_cmd="pnpm install --frozen-lockfile"; \
  else \
    install_cmd="npm install --fetch-retries=5 --fetch-retry-mintimeout=10000 --fetch-retry-maxtimeout=120000 --fetch-timeout=300000"; \
  fi; \
  for attempt in 1 2 3; do \
    sh -c "$install_cmd" && exit 0; \
    if [ "$attempt" -eq 3 ]; then \
      exit 1; \
    fi; \
    echo "Dependency install failed on attempt $attempt, retrying..."; \
    sleep $((attempt * 5)); \
  done

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build-time environment variables
ARG NEXT_PUBLIC_API_BASE_URL=https://api.eventcoresolutions.com
ARG NEXT_PUBLIC_ROOT_DOMAIN=eventcoresolutions.com
ARG NEXT_PUBLIC_SAAS_TENANT_ID
ARG NEXT_PUBLIC_APP_ENV=production

ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_ROOT_DOMAIN=$NEXT_PUBLIC_ROOT_DOMAIN
ENV NEXT_PUBLIC_SAAS_TENANT_ID=$NEXT_PUBLIC_SAAS_TENANT_ID
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_TELEMETRY_DISABLED=1

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install wget for healthcheck
RUN apk add --no-cache wget

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

# Internal port 3000, map to 3001 externally
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

CMD ["node", "server.js"]

