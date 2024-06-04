# Use the official Node.js 16 image as the base image
FROM node:16

# Create and change to the app directory
WORKDIR /app

# Install app dependencies
COPY package*.json ./

RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4000

# Run the application
CMD ["npm", "run", "serve"]
