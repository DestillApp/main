# 1) Build the Vite app
FROM node:18-alpine AS builder
WORKDIR /app

# Install deps
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# 2) Serve statics with "serve"
FROM node:18-alpine
WORKDIR /app

# globally install serve
RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 8080
CMD ["serve", "-s", "dist", "-l", "8080"]

