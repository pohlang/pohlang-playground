FROM node:18-alpine

# Install dependencies for running compiled binaries
# gcompat provides glibc compatibility for musl (Alpine)
# Additional libraries needed for Rust binaries
RUN apk add --no-cache \
    libc6-compat \
    libgcc \
    libstdc++ \
    gcompat

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --only=production

# Copy application code
COPY index.js ./

# Copy PohLang binary (you'll need to build this for Linux)
# Make sure you have bin/pohlang compiled for x86_64-unknown-linux-musl
COPY bin/pohlang /usr/local/bin/pohlang
RUN chmod +x /usr/local/bin/pohlang

# Set environment variables
ENV POHLANG_BIN=/usr/local/bin/pohlang
ENV PORT=8080
ENV NODE_ENV=production

# Expose port
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:8080/api/health', (r) => {if (r.statusCode !== 200) throw new Error('Health check failed')})"

# Run as non-root user
RUN addgroup -g 1001 -S nodejs && adduser -S nodejs -u 1001
USER nodejs

# Start application
CMD ["node", "index.js"]
