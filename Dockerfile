# Use official Node.js image as the base image
FROM node:latest

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json (if exists) to the working directory
COPY package*.json ./

COPY .env ./

# Install dependencies
RUN npm install

RUN npm install bcryptjs --save

# Copy the rest of the application code
COPY . .

# Expose port 3000 to the outside world
EXPOSE 3000

# Command to run your NestJS application
CMD ["npm", "run", "dev"]
