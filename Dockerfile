# --- ETAPA 1: Build ---
FROM node:22-alpine AS builder
LABEL description="Contenedor Next.js" \
      version="1.0" \
      maintainer="ingdanielbs" \
      vendor="SENA"

# Habilitar pnpm con corepack (forma oficial, sin npm install -g)
RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /opt/app-root/src

# Cacheo de dependencias
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ⚠️ Variable de entorno en build time
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Build de la app
COPY . .
RUN pnpm run build

# --- ETAPA 2: Runner (standalone) ---
FROM node:22-alpine AS runner
LABEL description="Contenedor Next.js" \
      version="1.0" \
      maintainer="ingdanielbs" \
      vendor="SENA"

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

WORKDIR /opt/app-root/src

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

COPY --from=builder --chown=1001:1001 /opt/app-root/src/public ./public
COPY --from=builder --chown=1001:1001 /opt/app-root/src/.next/standalone ./
COPY --from=builder --chown=1001:1001 /opt/app-root/src/.next/static ./.next/static

EXPOSE 3000
USER 1001

CMD ["node", "server.js"]