FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy your built Angular artifacts
COPY dist/apps/complexes/server /app/server
COPY dist/apps/complexes/browser /app/browser

EXPOSE 80

# Run the Express SSR server directly
CMD ["node", "/app/server/server.mjs"]
