# Use Node 20 base image
FROM node:20-bullseye

# Install build and media tools
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    build-essential \
    python3 && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install --force
RUN npm install yt-search @whiskeysockets/baileys lyrics-finder genius-lyrics --force

# Copy all source files
COPY . .

# Expose a port (optional)
EXPOSE 3000

# Start your bot
CMD ["npm", "start"]
