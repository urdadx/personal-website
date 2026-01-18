# 1. Base image with necessary system libraries
FROM node:20-alpine AS base
# Move libc6-compat to base so ALL stages inherit it (Crucial for build tools)
RUN apk add --no-cache libc6-compat
WORKDIR /app

# 2. Install dependencies (All deps, including dev)
FROM base AS deps
COPY package.json package-lock.json* ./
# Install ALL dependencies (needed for the build step)
RUN npm ci

# 3. Build the application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# --- ADD THIS SECTION ---
# Define the argument (passed from Dokploy build args)
ARG GITHUB_TOKEN
# Assign it to an ENV so the build script can access it
ENV GITHUB_TOKEN=$GITHUB_TOKEN

# Environment variables required for build usually go here
ENV NODE_ENV production
# Increase memory limit as you correctly identified
ENV NODE_OPTIONS="--max-old-space-size=4096"

# Run the build
RUN npm run build

# 4. Production Runner
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 tanstack

# Copy the standalone output from the builder
# TanStack Start/Vinxi builds to .output by default
COPY --from=builder --chown=tanstack:nodejs /app/.output ./.output

# Set user
USER tanstack

# Networking
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the server using the Node output directly
# This is more stable than "npm start" for production containers
CMD ["node", ".output/server/index.mjs"]
