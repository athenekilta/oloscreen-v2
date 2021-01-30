#!/bin/sh

FLASK_APP=/app/backend/menuproxy.py python -m flask run --port=3001 --host=0.0.0.0 &
python /app/backend/telegram-bot.py
