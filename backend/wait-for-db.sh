#!/bin/sh
# wait-for-db.sh
# Aguarda o MySQL estar disponível antes de iniciar a aplicação

set -e

# Se as variáveis não estiverem definidas, define padrão
DB_HOST=${DB_HOST:-db}
DB_PORT=${DB_PORT:-3306}

echo "⏳ Aguardando o banco de dados em $DB_HOST:$DB_PORT..."

# Loop até conseguir conectar
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Banco de dados indisponível, aguardando..."
  sleep 2
done

echo "✅ Banco de dados disponível! Iniciando a aplicação..."
exec "$@"
