FROM node:24-alpine AS runner

WORKDIR /app

ENV NG_TRUST_PROXY_HEADERS=true
ENV APP_BASE_HREF=/pdbe-srv/pdbechem/chemicalCompound/
ENV NODE_ENV=production
ENV PORT=80

COPY package*.json ./
RUN npm ci --legacy-peer-deps --ignore-scripts

# Copy your built Angular artifacts
COPY dist/apps/ligands/server /app/server
COPY dist/apps/ligands/browser /app/browser

EXPOSE 80


# Run the Express SSR server directly
CMD ["node", "--max-old-space-size=256", "/app/server/server.mjs"]