FROM node:24-alpine AS builder

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .

ARG VITE_DYNAMIC_ENVIRONMENT_ID
ENV VITE_DYNAMIC_ENVIRONMENT_ID=${VITE_DYNAMIC_ENVIRONMENT_ID}

RUN pnpm build

FROM node:24-alpine AS runtime

WORKDIR /app

RUN corepack enable

COPY --from=builder /app/package.json /app/pnpm-lock.yaml ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production
ENV NITRO_HOST=0.0.0.0
ENV NITRO_PORT=3000

EXPOSE 3000

CMD ["sh", "-c", "pnpm prisma migrate deploy && node .output/server/index.mjs"]
