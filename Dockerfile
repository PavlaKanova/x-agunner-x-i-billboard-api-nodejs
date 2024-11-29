# Base image: Node.js on Alpine
FROM node:18-alpine

# Install necessary packages including musl-dev (for native dependencies)
#RUN apk add --no-cache musl-dev

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies as the 'node' user
COPY package*.json ./
RUN npm install

# Install NestJS CLI globally as the 'node' user
RUN npm install -g @nestjs/cli

# Copy the application source code
COPY . .

# Build the application
RUN npm run build

# Ensure the app folder and files are owned by 'node'
RUN chown -R node:node /app

# Switch to the 'node' user (UID: 1000, GID: 1000) for non-root execution
USER node

