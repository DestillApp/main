# Use Node.js LTS Alpine for smaller image size
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files
COPY package*.json ./

# Install all dependencies (including devDependencies for build and preview)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .
RUN chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Build the application
RUN npm run build

# Expose port (Cloud Run will set PORT env var)
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/ || exit 1

# Start the application
CMD ["npm", "run", "preview", "--", "--port", "8080", "--host", "0.0.0.0"]

