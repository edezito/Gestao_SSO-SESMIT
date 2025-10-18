# Etapa de build
FROM node:20-alpine AS build
WORKDIR /app

# Copiar apenas os manifests primeiro (melhor cache)
COPY package*.json ./

# Forçar reinstalação limpa das dependências
RUN npm cache clean --force && npm install

# Copiar o restante dos arquivos
COPY . .

# Garantir que as dependências estejam corretas
RUN npm rebuild

# Rodar o build
RUN npm run build

# Etapa de produção (Nginx)
FROM nginx:alpine

# Copiar os arquivos do build
COPY --from=build /app/build /usr/share/nginx/html

# Remover config padrão e adicionar a customizada
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
