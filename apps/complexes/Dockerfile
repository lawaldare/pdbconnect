FROM node:22-alpine AS runner

WORKDIR /app

ARG APP_BASE_HREF=/
ENV APP_BASE_HREF=$APP_BASE_HREF
ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy your built Angular artifacts
COPY dist/apps/complexes/server /app/server
COPY dist/apps/complexes/browser /app/browser

# Handle the runtime base href substitution you had before
RUN find /app/server /app/browser -type f \( -name "*.mjs" -o -name "*.html" -o -name "*.js" \) -exec sed -i "s|\\$APP_BASE_HREF|${APP_BASE_HREF}|g" {} +

EXPOSE 80

# Run the Express SSR server directly
CMD ["node", "/app/server/server.mjs"]
