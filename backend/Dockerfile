FROM python:3.11-slim

WORKDIR /app

# Instala netcat
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Dependências
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Código da aplicação
COPY app.py /app/
COPY src/ /app/src/
COPY wait-for-db.sh /app/
RUN chmod +x /app/wait-for-db.sh

# Variáveis de ambiente Flask
ENV FLASK_APP=app:create_app
ENV FLASK_RUN_HOST=0.0.0.0
ENV FLASK_RUN_PORT=5000
ENV PYTHONPATH=/app

# Comando inicial
CMD ["./wait-for-db.sh", "flask", "run"]
