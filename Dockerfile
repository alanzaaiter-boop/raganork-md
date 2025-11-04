FROM node:18-bullseye

# Install build tools + media tools
RUN apt-get update && \
    apt-get install -y \
    ffmpeg \
    imagemagick \
    webp \
    build-essential \
    python3 && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY package*.json ./
RUN npm install --force

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
