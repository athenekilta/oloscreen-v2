from flask import Flask, jsonify
from datetime import datetime
import requests

app = Flask(__name__)


@app.route('/restaurants/')
def restaurants():
    timestamp = datetime.now().strftime("%Y/%m/%d");
    sodexo_url = f'https://kitchen.kanttiinit.fi/restaurants/2/menu?day={timestamp}/';
    return jsonify({'sodexo': requests.get(sodexo_url).json()})
