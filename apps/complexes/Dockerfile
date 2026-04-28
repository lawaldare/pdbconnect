FROM node:22-alpine

WORKDIR /app

ARG APP_BASE_HREF=/
ENV APP_BASE_HREF=$APP_BASE_HREF
ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm ci --omit=dev --legacy-peer-deps --ignore-scripts && npm install @angular/ssr@20.2.2 --omit=dev --legacy-peer-deps --ignore-scripts

COPY dist/apps/complexes ./dist
RUN test -f dist/browser/index.html && sed -i "s|\\$APP_BASE_HREF|${APP_BASE_HREF}|g" dist/browser/index.html

EXPOSE 80

CMD ["node", "dist/server/server.mjs"]
