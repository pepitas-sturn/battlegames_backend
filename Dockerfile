# Stage 1: Build Stage
FROM node:18 as builder

# Set working directory
WORKDIR /app

# Copy package files for dependencies installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build TypeScript (or the application)
RUN npm run build

# Stage 2: Production Stage
FROM node:18-slim

# # Install Redis server
RUN apt-get update && \
    apt-get install -y redis-server && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# updating and installing dependency
RUN apt-get update -y && apt-get install -y openssl

# Set working directory
WORKDIR /app

# Copy the build files and dependencies from the builder stage
COPY --from=builder /app ./

# # Expose Redis port
EXPOSE 6379

# Expose application port
EXPOSE 9000

# Start Redis and your Node.js application
# CMD ["bash", "-c", "service redis-server start && node dist/index.js"]

# CMD ["bash", "-c", "service node dist/index.js"]
CMD ["node", "dist/index.js"]
