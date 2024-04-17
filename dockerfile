# Stage 1: Build Node.js application
FROM node:20.12.2 AS nodejs-build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY /ai-chatbot/package*.json .
COPY /ai-chatbot/pnpm-lock.yaml .
# Install dependencies
RUN npm install -g pnpm@8.6.3
RUN pnpm --version
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY /ai-chatbot .

# Copy Python dependencies
COPY /python/requirements.txt ./python/requirements.txt

# Install Python dependencies
RUN apt-get update -y
RUN apt-get install python3-pip -y
RUN pip install -r ./python/requirements.txt --break-system-packages

# Copy the rest of the Python application code
COPY /python ./python

# Expose any ports the app needs
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "dev"]
