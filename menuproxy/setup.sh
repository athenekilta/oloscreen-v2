if [ -d "venv" ]; then
    echo Virtualenv venv exists already, not creating it
else
    virtualenv venv -p python3
fi
source venv/bin/activate
pip install -r requirements.txt
