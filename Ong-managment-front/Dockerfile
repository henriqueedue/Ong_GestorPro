# =============================================================================
# Build Stage
# =============================================================================
FROM node:22-alpine AS builder
RUN corepack enable && corepack prepare pnpm@10.4.1 --activate
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
COPY patches ./patches
RUN pnpm install --frozen-lockfile
COPY . .
RUN pnpm run build

# =============================================================================
# Production Stage (Nginx)
# =============================================================================
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*

# CORREÇÃO: Copiamos o conteúdo da subpasta 'public' para a raiz do Nginx
COPY --from=builder /app/dist/public /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]