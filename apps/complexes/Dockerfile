FROM node:22-alpine AS runner

WORKDIR /app

ARG APP_BASE_HREF=/
ENV APP_BASE_HREF=$APP_BASE_HREF
ENV NODE_ENV=production
ENV PORT=4000

COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

COPY dist/apps/complexes/server /app/server
COPY dist/apps/complexes/browser /app/browser

RUN find /app/server /app/browser -type f \( -name "*.mjs" -o -name "*.html" \) -exec sed -i "s|\\$APP_BASE_HREF|${APP_BASE_HREF}|g" {} +

EXPOSE 4000

CMD ["node", "/app/server/server.mjs"]
