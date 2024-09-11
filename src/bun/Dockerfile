# Use the official Bun image
FROM oven/bun:latest

# Set the working directory
WORKDIR /app

#HACK: for debuugging based on https://github.com/oven-sh/bun/issues/7490
# WORKDIR /Users/michael.riha/Projects/bonrepublic/rqlite-poc

# Copy the package.json and bun.lockb first for better layer caching
COPY package.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 3000 
EXPOSE 6499

# Start the application with nodemon, enabling debugging with Bun
# CMD ["bun", "nodemon", "--watch", "src", "--exec", "bun run --inspect src/index.js"]

# Start the application with Bun
CMD ["bun", "src/index.js"]