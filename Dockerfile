FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install --frozen-lockfile || npm install
COPY tsconfig.json tsconfig.build.json jest.config.ts ./
COPY prisma ./prisma
COPY migrations ./migrations
COPY src ./src
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/migrations ./migrations
CMD ["node", "dist/server.js"]
