FROM python:3.13-slim

ENV PYTHONUNBUFFERED=1
ENV PYTHONDONTWRITEBYTECODE=1
WORKDIR /app
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN SECRET_KEY=empty DATABASE_URL=none python manage.py collectstatic --noinput

RUN addgroup --system django && adduser --system --group django
USER django

CMD ["gunicorn", "config.wsgi:application", "--bind", "0.0.0.0:8000"]
