FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Create .env from example if it doesn't exist
RUN cp -n .env.example .env || true

# Create necessary directories
RUN mkdir -p /app/documents /app/uploads /app/records

# Expose port
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 