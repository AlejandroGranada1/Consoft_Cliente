# --- ETAPA 1: Build ---
FROM node:22-alpine AS builder
LABEL description="Contenedor Next.js" \
      version="1.0" \
      maintainer="ingdanielbs" \
      vendor="SENA"

RUN apk update && apk upgrade --no-cache

RUN corepack enable && corepack prepare pnpm@latest --activate

WORKDIR /opt/app-root/src

COPY package.json pnpm-lock.yaml ./

# Instala TODAS las deps para poder hacer el build
RUN pnpm install --frozen-lockfile

ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

COPY . .
RUN pnpm run build

# Elimina devDependencies después del build
RUN pnpm prune --prod

# --- ETAPA 2: Runner (standalone) ---
FROM node:22-alpine AS runner
LABEL description="Contenedor Next.js" \
      version="1.0" \
      maintainer="ingdanielbs" \
      vendor="SENA"

RUN apk update && apk upgrade --no-cache

# Eliminar npm, yarn y corepack preinstalados para reducir la superficie de ataque y evitar falsos positivos
RUN rm -rf /usr/local/lib/node_modules /usr/local/bin/npm /usr/local/bin/npx /usr/local/bin/corepack /usr/local/bin/yarn /usr/local/bin/yarnpkg

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