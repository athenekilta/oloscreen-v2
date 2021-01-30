from flask import Flask, jsonify, make_response,  send_from_directory
from datetime import datetime, timedelta
import requests
import subway
import os
import get_menus


app = Flask(__name__, static_folder='../build')

# Serve React App


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    if path != "":
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, 'index.html')



sodexo_id = '2'


amica_url = "https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0199&language=fi"

sodexo_menu = 'https://kitchen.kanttiinit.fi/menus?lang=fi&restaurants=' + sodexo_id + '&days={}/'

sodexo_opening_hours = f'https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids={sodexo_id}'



@app.after_request
def allow_cors(response):
    response.headers['Access-Control-Allow-Origin'] = "*"
    return response


def get_json(url):
    return requests.get(url).json()


@app.route('/restaurants/')
def restaurants():
    return jsonify(get_menus.restaurants())


def shoutbox():
    dir = os.path.join(os.getcwd(), "telegram-messages.txt")
    try:
        with open(dir) as messages:
            # the last row is always empty
            return jsonify(messages.read().split("\n")[:-1])
    except FileNotFoundError:
        with open(dir, 'w') as messages:
            pass
        return jsonify([])


if __name__ == "__main__":
    app.run(host='0.0.0.0')
