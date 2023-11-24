# Base image
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the frontend
WORKDIR /app/frontend
RUN npm install && npm run build

# Start a new stage from scratch for the final image
FROM node:18-alpine

WORKDIR /app

# Copy built assets from the builder stage
COPY --from=builder /app/frontend/build ./frontend/build
COPY --from=builder /app .

# Install only production dependencies
RUN npm install --production


# Start the application
CMD ["npm", "run", "dev"]
