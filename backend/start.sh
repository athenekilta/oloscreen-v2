if [ -d "venv" ]; then
    source venv/bin/activate
fi
if command -v python3 &>/dev/null; then
    FLASK_APP=menuproxy.py python3 -m flask run --port 3000
else
    FLASK_APP=menuproxy.py python -m flask run --port 3000
fi
