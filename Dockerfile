# Use the official Node.js image as a base
FROM node:16.13.0

# Set a working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your app's source code to the container
COPY . .

# Expose the port your app will run on
EXPOSE 3000

# Set environment variables from .env file
ENV JWT_SECRET='your-secret-key-here'
ENV JWT_EXPIRATION_HOURS='720h'
ENV SALT_ROUNDS=10
# Start your Node.js app
CMD ["node", "app.js"]
