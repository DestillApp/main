FROM node:18-alpine
WORKDIR /app

# Install only production deps
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Backend listens on 3000 for GraphQL and 4000 for any other endpoints
EXPOSE 3000 4000

# Use a non-dev watcher in prod
CMD ["node", "src/app.js"]

