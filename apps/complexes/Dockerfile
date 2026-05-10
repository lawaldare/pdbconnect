FROM node:22-alpine AS runner

WORKDIR /app

ARG APP_BASE_HREF=/
ENV APP_BASE_HREF=$APP_BASE_HREF
ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts && npm install @angular/ssr@20.2.2 xhr2@0.2.0 --omit=dev --legacy-peer-deps --ignore-scripts

COPY dist/apps/complexes/server /app/server
COPY dist/apps/complexes/browser /app/browser

RUN test -f /app/browser/index.html && sed -i "s|\\$APP_BASE_HREF|${APP_BASE_HREF}|g" /app/browser/index.html

EXPOSE 80

CMD ["node", "/app/server/server.mjs"]
