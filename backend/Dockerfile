FROM python:3.11-slim

WORKDIR /app

# Dependências do sistema
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd gcc libffi-dev build-essential \
 && rm -rf /var/lib/apt/lists/*

# Instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir gunicorn

# Copia código
COPY src/ ./src/
COPY app.py .
COPY wait-for-db.sh /app/wait-for-db.sh
RUN chmod +x /app/wait-for-db.sh

ENV FLASK_ENV=production

EXPOSE 5000

CMD ["/app/wait-for-db.sh", "db:3306", "15", "2", "gunicorn", "app:app", "-b", "0.0.0.0:5000", "--workers", "2", "--timeout", "120"]
