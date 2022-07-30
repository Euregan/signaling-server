# syntax=docker/dockerfile:1
FROM node:16.14.0-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run postinstall

CMD ["node", "dist/server.js"]
EXPOSE 80 443
