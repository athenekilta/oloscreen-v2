#!/bin/sh

cd /app/backend/
python ./telegram-bot.py &
gunicorn -b 0.0.0.0:3001 menuproxy
