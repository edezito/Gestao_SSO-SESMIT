#!/bin/sh
# usage: wait-for-db.sh host:port [attempts] [sleep_seconds] cmd...
# ex: ./wait-for-db.sh db:3306 15 2 gunicorn ...
set -e

HOSTPORT=${1:?Need host:port as first arg}
ATTEMPTS=${2:-15}
SLEEP=${3:-2}
shift 3

HOST=${HOSTPORT%:*}
PORT=${HOSTPORT##*:}

echo "Aguardando o banco de dados em $HOST:$PORT..."

i=0
while ! nc -z "$HOST" "$PORT"; do
  i=$((i+1))
  if [ "$i" -ge "$ATTEMPTS" ]; then
    echo "DB não disponível após $ATTEMPTS tentativas, abortando."
    exit 1
  fi
  echo "Banco de dados indisponível, aguardando... ($i/$ATTEMPTS)"
  sleep "$SLEEP"
done

echo "Connection to $HOST:$PORT succeeded!"
# execute o comando passado
exec "$@"
