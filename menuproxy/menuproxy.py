from flask import Flask, jsonify, make_response
from datetime import datetime
import requests
import subway

app = Flask(__name__)

amica_url = "https://www.fazerfoodco.fi/modules/json/json/Index?costNumber=0199&language=fi"
sodexo_url = 'https://kitchen.kanttiinit.fi/restaurants/2/menu?day={}/'


def get_json(url):
    return requests.get(url).json()

@app.route('/restaurants/')
def restaurants():
    timestamp = datetime.now().strftime("%Y/%m/%d")
    weekday = datetime.now().weekday()
    amica_timestamp = "&date="
    # Use monday 25.2.19 for testing purposes
    if timestamp == '2019/02/24':
        timestamp = "2019/02/25"
        amica_timestamp += '2019-02-25'

    data = {}
    data['sodexo'] = get_json(sodexo_url.format(timestamp))
    data['amica'] = get_json(amica_url + amica_timestamp)
    if len(data['sodexo']['menus']):  # If there are menus on sodexo
        data['subway'] = data['sodexo']['menus'][0]['courses'].pop(-1)
    else:
        if weekday == 5:  # Hardcoded daily sub for Saturdays
            title = "Kinkku"
        else:
            title = ""  # Return empty title when closed
        data['subway'] = {'title': title, "properties": []}
    data['subway']['title'] = data['subway']['title'].replace("Subway: ","")
    data['subway']['openingHours'] = subway.get_opening_hours()[weekday]

    resp = make_response(jsonify(data))
    resp.headers['Access-Control-Allow-Origin'] = '*'

    return resp
