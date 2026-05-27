FROM node:22-alpine AS runner

WORKDIR /app

ENV NG_TRUST_PROXY_HEADERS=true
ENV APP_BASE_HREF=/pdbe/pdbe-kb/complexes/
ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# 1. Copy the server artifacts normally
COPY dist/apps/complexes/server /app/server

# 2. Copy the WHOLE browser artifact folder into a temporary staging area
COPY dist/apps/complexes/browser /app/browser-staging

# 3. Use an automatic shell command to find wherever the files landed and flatten them into /app/browser!
RUN mkdir -p /app/browser && \
    if [ -d "/app/browser-staging/pdbe/pdbe-kb/complexes" ]; then \
        cp -r /app/browser-staging/pdbe/pdbe-kb/complexes/* /app/browser/; \
    else \
        cp -r /app/browser-staging/* /app/browser/; \
    fi && \
    rm -rf /app/browser-staging

EXPOSE 80


# Run the Express SSR server directly
CMD ["node", "--use-env-proxy", "/app/server/server.mjs"]
