FROM python:3.11-slim

WORKDIR /app

# Dependências do sistema (INCLUINDO FONTES para PDF)
RUN apt-get update && apt-get install -y --no-install-recommends \
    netcat-openbsd \
    gcc \
    libffi-dev \
    build-essential \
    libfreetype6-dev \
    libpng-dev \
    pkg-config \
    default-libmysqlclient-dev \
    fonts-dejavu \
    fonts-liberation \
    fonts-freefont-ttf \
 && rm -rf /var/lib/apt/lists/*

# Instala dependências Python
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copia código
COPY src/ ./src/
COPY app.py .

ENV FLASK_ENV=production
ENV PYTHONPATH=/app/src

EXPOSE 5000

# Comando direto
CMD ["gunicorn", "--bind", "0.0.0.0:5000", "--workers", "2", "--timeout", "120", "app:app"]