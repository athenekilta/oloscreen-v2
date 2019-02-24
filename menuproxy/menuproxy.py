from flask import Flask, jsonify, make_response
from datetime import datetime
import requests

app = Flask(__name__)


@app.route('/restaurants/')
def restaurants():
    timestamp = datetime.now().strftime("%Y/%m/%d")
    sodexo_url = f'https://kitchen.kanttiinit.fi/restaurants/2/menu?day={timestamp}/'
    resp = make_response(jsonify({'sodexo': requests.get(sodexo_url).json()}))
    resp.headers['Access-Control-Allow-Origin'] = '*'
    return resp
