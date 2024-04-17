# Stage 1: Build Node.js application
FROM node:20.12.2 AS nodejs-build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY /ai-chatbot/package*.json ./
COPY /ai-chatbot/pnpm-lock.yaml ./
# Install dependencies
RUN npm install -g pnpm@8.6.3
RUN pnpm --version
RUN pnpm install

# Copy the rest of the application code to the working directory
COPY /ai-chatbot .

# Stage 2: Build Python application
FROM python:3.10.13 AS python-build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy Python dependencies
COPY /python/requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the Python application code
COPY /python .

# Stage 3: Final image
FROM node:20.12.2

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy Node.js build artifacts from the previous stage
COPY --from=nodejs-build /usr/src/app ./dist

# Copy Python dependencies from the previous stage
COPY --from=python-build /usr/src/app .

# Expose any ports the app needs
EXPOSE 3000

# Command to run the application
CMD ["pnpm", "dev"]
