# syntax=docker/dockerfile:1

FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_APP_NAME="Laravel API Base"
ARG VITE_APP_ENV=production
ARG VITE_API_BASE_URL=http://localhost:8000/api/v1

ENV VITE_APP_NAME=${VITE_APP_NAME}
ENV VITE_APP_ENV=${VITE_APP_ENV}
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN cp vite.config.example.ts vite.config.ts \
    && npm run build

FROM nginx:1.27-alpine AS production

COPY docker/nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://127.0.0.1/healthz || exit 1
