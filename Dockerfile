FROM python:3.9-buster

COPY backend/requirements.txt /app/backend/requirements.txt

RUN pip install -r /app/backend/requirements.txt


COPY backend/ /app/backend/

CMD ["sh", "/app/backend/start-backend-docker.sh"]
