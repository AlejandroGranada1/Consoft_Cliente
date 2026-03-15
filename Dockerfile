# --- ETAPA 1: Build ---
FROM node:20-slim AS builder

LABEL description="Contenedor Next.js" \
      version="1.0" \
      maintainer="ingdanielbs" \
      vendor="SENA"

WORKDIR /opt/app-root/src

# Cacheo de dependencias
COPY package*.json ./
RUN npm i

# ⚠️ Variable de entorno en build time (Next.js la necesita al compilar)
ARG NEXT_PUBLIC_GOOGLE_CLIENT_ID
ENV NEXT_PUBLIC_GOOGLE_CLIENT_ID=$NEXT_PUBLIC_GOOGLE_CLIENT_ID

# Build de la app
COPY . .
RUN npm run build

# --- ETAPA 2: Runner (standalone) ---
FROM node:20-slim AS runner

LABEL description="Contenedor Next.js" \
      version="1.0" \
      maintainer="ingdanielbs" \
      vendor="SENA"

RUN addgroup --gid 1001 appgroup && \
    adduser --disabled-password --uid 1001 --ingroup appgroup appuser

WORKDIR /opt/app-root/src

COPY --from=builder --chown=1001:1001 /opt/app-root/src/public ./public
COPY --from=builder --chown=1001:1001 /opt/app-root/src/.next/standalone ./
COPY --from=builder --chown=1001:1001 /opt/app-root/src/.next/static ./.next/static

EXPOSE 3000
USER 1001

CMD ["node", "server.js"]
