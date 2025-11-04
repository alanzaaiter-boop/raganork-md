# Use an official Node.js image
FROM node:18

# Install ffmpeg
RUN apt-get update && apt-get install -y ffmpeg

# Create and set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all project files
COPY . .

# Expose port (optional, useful if your bot uses a web dashboard or webhook)
EXPOSE 3000

# Start the bot
CMD ["npm", "start"]
