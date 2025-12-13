# Node 22 Alpine (very lightweight)
FROM node:22-alpine

# Install bash & curl (optional but useful)
RUN apk add --no-cache bash curl

# Install Bun
RUN curl -fsSL https://bun.sh/install | bash

# Add Bun to PATH
ENV PATH="/root/.bun/bin:${PATH}"

# Set working directory
WORKDIR /app

# Expose common dev port
EXPOSE 3000

# Default command
CMD ["bun", "--version"]
