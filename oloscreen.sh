#!/bin/bash
set -e
cd ~/oloscreen-v2/
npm start &
cd backend
./start.sh &
source venv/bin/activate
python3 telegram-bot.py
