# Use Debian-based Node image for full glibc compatibility
FROM node:18-slim

# Install necessary runtime dependencies
RUN apt-get update && apt-get install -y \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

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

# Run as non-root user (Debian syntax)
RUN groupadd --gid 1001 nodejs && \
    useradd --uid 1001 --gid nodejs --shell /bin/bash --create-home nodejs
USER nodejs

# Start application
CMD ["node", "index.js"]
