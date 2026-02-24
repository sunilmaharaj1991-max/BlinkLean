# Root Dockerfile for Render Manual Deployment
FROM node:20-alpine AS builder

WORKDIR /app

# Copy backend dependency files
COPY blinklean-backend/package*.json ./
RUN npm ci

# Copy backend source code
COPY blinklean-backend/ .

# Build the project
RUN npm run build

# Final production image
FROM node:20-alpine

WORKDIR /app

# Copy built assets from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Set production environment
ENV NODE_ENV=production
ENV PORT=10000

EXPOSE 10000

# Start the server
CMD ["node", "dist/main"]
