# Base image
FROM node:18-alpine

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy app source
COPY . .

# Build the Vue.js application for production
RUN npm run build

# Install the serve package to serve static files
RUN npm install -g serve

# Expose port
EXPOSE 80 8080

# Run the application in production mode
CMD ["serve", "-s", "dist"]
