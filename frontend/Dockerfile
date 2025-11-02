# frontend/Dockerfile

# --- Build stage
FROM node:20-alpine AS build
WORKDIR /app

# Copiar package lock/manifest antes para aproveitar cache
COPY package*.json ./
# Use npm ci para installs reprodutíveis
RUN npm ci

# Copia fontes e build
COPY . .
RUN npm run build

# --- Production stage
FROM nginx:alpine
# Copia build estático
COPY --from=build /app/build /usr/share/nginx/html

# Substitui o default.conf com nossa config
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
