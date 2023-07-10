from datetime import datetime, timedelta
import requests
from pprint import pprint
from zoneinfo import ZoneInfo

RESTAURANTS = {
    'sodexo': '2',
    'tuas': '7',
    'abloc': '52'
}

KANTTIINIT_URL = 'https://kitchen.kanttiinit.fi/menus?lang=fi&restaurants={}&days={}/'

KANTTIINIT_OPENING_HOURS = 'https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids={}'


def get_json(url):
    return requests.get(url).json()


def restaurants():
    today = datetime.now(ZoneInfo("Europe/Helsinki"))
    date = today.strftime("%Y-%m-%d")
    weekday = today.weekday()

    restaurant_ids = ','.join(RESTAURANTS.values())
    all_menus = get_json(KANTTIINIT_URL.format(restaurant_ids, date))

    data = {name: {'menus': [], 'openingHours': {}} for name in RESTAURANTS}

    def parse(name, id):
        data[name]['menus'] = all_menus[id].get(today.strftime("%Y-%m-%d"), [])
        data[name]['openingHours'] =  get_json(KANTTIINIT_OPENING_HOURS.format(id))[0]['openingHours']

    for name, id in RESTAURANTS.items():
        parse(name, id)

    def filter_foods(restaurant, keyword):
        data[restaurant]['menus'] = [x for x in data[restaurant]['menus'] if not x['title'].startswith(keyword) ]

    filters = {'abloc': ['Wicked', 'Pizza', 'Chef', 'Campus Bread'], 'tuas': ['Jälkiruo', 'Erikoisannos', 'Fresh'] }

    for restaurant, keywords in filters.items():
        for keyword in keywords:
            filter_foods(restaurant, keyword)


    return data

if __name__ == "__main__":
    data = restaurants()
    pprint(data)
