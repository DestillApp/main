# Stage 1: build the Vite app
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build into /app/dist
COPY . .
RUN npm run build

# Stage 2: serve the compiled assets
FROM node:18-alpine
WORKDIR /app

# Install 'serve' to host static files
RUN npm install --global serve

# Copy built files
COPY --from=builder /app/dist ./dist

# Expose the port for k8s Service
EXPOSE 8080

# Serve in single-page-app mode
CMD ["serve", "-s", "dist", "-l", "8080"]

