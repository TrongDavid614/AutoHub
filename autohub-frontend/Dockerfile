# Stage 1: Build React App with Node.js
FROM node:22-alpine AS builder
WORKDIR /app

# Install dependencies first for Docker layer caching
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build
COPY . .

# Pass API URL during build (defaults to /api so Nginx handles reverse proxy)
ARG VITE_API_URL=/api
ARG VITE_USE_MOCK=false
ARG VITE_GOOGLE_CLIENT_ID=833436348399-eka9dmurcvtflggm4fl30aud9sr1snj5.apps.googleusercontent.com
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_USE_MOCK=$VITE_USE_MOCK
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID

RUN npm run build

# Stage 2: Production Nginx Server
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Clean default nginx static files
RUN rm -rf ./*

# Copy build artifacts from builder stage
COPY --from=builder /app/dist .

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
