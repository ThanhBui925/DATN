# Stage 1: Cài dependencies
FROM node:18 AS base
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm install

# Stage 2: Dev mode (hot reload)
FROM base AS dev
WORKDIR /app
COPY . .
EXPOSE 3000
CMD ["npm", "run", "dev"]
