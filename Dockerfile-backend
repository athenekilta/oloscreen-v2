FROM python:3.9-buster

COPY backend/ /app/backend/

RUN pip install -r /app/backend/requirements.txt

CMD ["sh", "/app/backend/start-backend-docker.sh"]
