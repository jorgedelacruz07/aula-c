FROM node:26-alpine

WORKDIR /app
COPY api/package.json api/package-lock.json ./
RUN npm ci --omit=dev
COPY api/server.mjs ./server.mjs

ENV NODE_ENV=production
CMD ["node", "server.mjs"]
