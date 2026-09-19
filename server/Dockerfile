FROM python:3.12-slim

WORKDIR /app

# stops python from writing .pyc files into image
ENV PYTHONDONTWRITEBYTECODE=1
# forces stdout/stderr straight to terminal — logs show in docker logs
ENV PYTHONUNBUFFERED=1

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# non-root user
RUN adduser --disabled-password --no-create-home appuser

COPY . .

USER appuser

HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')" \
    || exit 1

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]