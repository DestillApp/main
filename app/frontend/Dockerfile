# Use an official Node.js runtime as a parent image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install project dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Vue.js application for production
RUN npm run build

# Install the serve package to serve static files
RUN npm install -g serve

# Expose port 80 for serving the app
EXPOSE 80 8080

# Run the application in production mode
CMD ["serve", "-s", "dist"]

