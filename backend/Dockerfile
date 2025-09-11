FROM python:3.11-slim

WORKDIR /app

# Instala netcat (netcat-openbsd)
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY src/ ./src/
COPY wait-for-db.sh /app/
RUN chmod +x /app/wait-for-db.sh

ENV FLASK_APP=src.app:create_app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000

CMD ["./wait-for-db.sh", "flask", "run"]
