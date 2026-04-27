FROM node:20-alpine3.20 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

COPY . .

RUN npx nx build complexes --configuration=production


# ---------- RUNTIME STAGE ----------
FROM node:20-alpine3.20

WORKDIR /app

COPY --from=builder /app/dist/apps/complexes ./dist

RUN npm install express xhr2 --omit=dev

EXPOSE 80

CMD ["node", "dist/server/main.js"]