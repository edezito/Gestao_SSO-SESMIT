#!/bin/sh
# Espera o MySQL estar disponível
echo "Aguardando o banco de dados em $DB_HOST:$DB_PORT..."
until nc -z -v -w30 $DB_HOST $DB_PORT
do
  echo "Banco de dados indisponível, aguardando..."
  sleep 2
done
echo "Banco de dados disponível!"
exec "$@"
