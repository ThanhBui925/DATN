# Stage 1: Cài dependencies
FROM node:18 AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Build app
FROM deps AS builder
WORKDIR /app
COPY . .
RUN npm run build

# Stage 3: Serve app
FROM node:18-alpine AS runner
WORKDIR /app
RUN npm install -g serve
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
