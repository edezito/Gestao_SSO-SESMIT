# frontend/Dockerfile

# --- Estágio de Build ---
# Usa uma imagem Node.js para construir a aplicação React
FROM node:20-alpine AS build

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia os arquivos de dependências primeiro para aproveitar o cache do Docker.
# Se esses arquivos não mudarem, o 'npm install' não roda de novo.
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o resto do código da aplicação
COPY public/ ./public/
COPY src/ ./src/

# Roda o script de build para criar a versão otimizada de produção
RUN npm run build

# --- Estágio de Produção ---
# Usa uma imagem Nginx leve para servir os arquivos estáticos
FROM nginx:alpine

# Copia os arquivos gerados no estágio de build para a pasta do Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia sua configuração personalizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/

# Expõe a porta 80 para acesso externo
EXPOSE 80

# Comando para iniciar o servidor Nginx
CMD ["nginx", "-g", "daemon off;"]