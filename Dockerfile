# Use a Node base image that supports apt properly
FROM node:18-bullseye

# Install required system tools (FFmpeg, WebP, ImageMagick)
RUN apt-get update && \
    apt-get install -y ffmpeg imagemagick webp && \
    rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy all project files
COPY . .

# Expose port (optional, for dashboard/web)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
