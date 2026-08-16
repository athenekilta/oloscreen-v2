import os
import secrets
from threading import Lock

import requests
from flask import Flask, jsonify, request, send_from_directory

import get_balances
import get_debts
import get_logos
import get_menus
from calendar_client import get_future_events, get_next_hype_event


application = Flask(__name__, static_folder='../public')
app = application


kissa_state = {'enabled': False}
kissa_state_lock = Lock()
reload_requested = False
reload_requested_lock = Lock()


def control_auth_error():
    expected_token = os.environ.get('OLOSCREEN_KISSA_TOKEN')
    authorization = request.headers.get('Authorization', '')

    if not expected_token:
        return jsonify({'error': 'Remote control is not configured'}), 503

    if not secrets.compare_digest(authorization, f'Bearer {expected_token}'):
        return jsonify({'error': 'Unauthorized'}), 401

    return None


@app.route('/api/kissa', methods=['GET'])
def get_kissa_state():
    with kissa_state_lock:
        response = jsonify(kissa_state)
    response.headers['Cache-Control'] = 'no-store'
    return response


@app.route('/api/kissa', methods=['POST'])
def set_kissa_state():
    auth_error = control_auth_error()
    if auth_error is not None:
        return auth_error

    body = request.get_json(silent=True) or {}
    enabled = body.get('enabled')
    if type(enabled) is not bool:
        return jsonify({'error': "'enabled' must be a boolean"}), 400

    with kissa_state_lock:
        kissa_state['enabled'] = enabled
        response = jsonify(kissa_state)
    response.headers['Cache-Control'] = 'no-store'
    return response


@app.route('/api/reload', methods=['POST'])
def request_reload():
    auth_error = control_auth_error()
    if auth_error is not None:
        return auth_error

    global reload_requested
    with reload_requested_lock:
        reload_requested = True

    return jsonify({'reload_requested': True}), 202


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

@app.route('/debts/')
def debts():
    return jsonify(get_debts.debts())

@app.route('/balances/')
def balances():
    global reload_requested
    with reload_requested_lock:
        reload = reload_requested
        reload_requested = False

    return jsonify(get_balances.balances(reload=reload))

@app.route('/logo-links/')
def logo_links():
    return jsonify(get_logos.get_all_logo_links())


@app.route('/shoutbox/')
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

@app.route('/calendar/')
def calendar():
    return jsonify(get_future_events())

@app.route('/hype/')
def hype():
    return jsonify(get_next_hype_event())

if __name__ == "__main__":
    app.run(host='0.0.0.0')
