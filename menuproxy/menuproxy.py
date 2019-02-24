from flask import Flask, jsonify
from datetime import datetime
import requests

app = Flask(__name__)

timestamp = datetime.now().strftime("%Y/%m/%d");
sodexo_url = f'https://kitchen.kanttiinit.fi/restaurants/2/menu?day={timestamp}/';

@app.route('/restaurants/')
def restaurants():
    return jsonify({'sodexo': requests.get(sodexo_url).json()})
