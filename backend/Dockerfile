FROM node:18-alpine
WORKDIR /app

# Install production dependencies only
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Copy source code
COPY . .

# Default to production environment
ENV NODE_ENV=production

# Expose GraphQL and REST ports
EXPOSE 3000
EXPOSE 4000

# Start the server
# (app.js reads process.env.MONGODB_URI and process.env.JWT_SECRET) :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
CMD ["npm start"]

