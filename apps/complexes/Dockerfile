FROM node:22-alpine AS builder

WORKDIR /app

ARG APP_BASE_HREF
ENV APP_BASE_HREF=$APP_BASE_HREF

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npx nx build complexes --configuration=production


FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts

COPY --from=builder /app/dist/apps/complexes ./dist

EXPOSE 80

CMD ["node", "dist/server/server.mjs"]
