# 1. Use the correct Node version
FROM node:20-alpine

WORKDIR /app

# 2. Install dependencies
COPY package*.json ./
RUN npm install

# 3. Copy the source code (including your tsconfig.json and src folder)
COPY . .

# 4. Compile the TypeScript into JavaScript (creates the /dist folder)
RUN npm run build

# 5. Expose the gRPC port
EXPOSE 50051

# 6. Start the server using the compiled code
CMD ["npm", "start"]