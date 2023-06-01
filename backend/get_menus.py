from datetime import datetime, timedelta
import requests
from pprint import pprint

sodexo_id = '2'
tuas_id = '7'
abloc_id = '52'

kanttiinit_url = 'https://kitchen.kanttiinit.fi/menus?lang=fi&restaurants={}&days={}/'

kanttiinit_opening_hours = 'https://kitchen.kanttiinit.fi/restaurants?lang=fi&ids={}'


def get_json(url):
    return requests.get(url).json()


def restaurants():
    today = datetime.now()
    timestamp = today.strftime("%Y-%m-%d")
    # Change the date for testing purposes
    if timestamp == '2020-01-25':
        today = datetime.now() + timedelta(days=-1)
        timestamp = today.strftime("%Y-%m-%d")
    weekday = today.weekday()

    restaurant_ids = ','.join([sodexo_id, tuas_id, abloc_id])
    all_menus = get_json(kanttiinit_url.format(restaurant_ids, timestamp))

    data = {"sodexo": {}, "tuas": {}, "abloc": {}}

    def parse(name, id):
        data[name]['menus'] = all_menus[id].get(today.strftime("%Y-%m-%d"), [])
        data[name]['openingHours'] =  get_json(kanttiinit_opening_hours.format(id))[0]['openingHours']

    for item in [('sodexo', sodexo_id), ('tuas', tuas_id), ('abloc', abloc_id)]:
        parse(*item)

    def filter_foods(restaurant, keyword):
        data[restaurant]['menus'] = [x for x in data[restaurant]['menus'] if not x['title'].startswith(keyword) ]

    filters = {'abloc': ['Wicked', 'Pizza', 'Chef', 'Campus Bread'], 'tuas': ['Jälkiruo', 'Erikoisannos', 'Fresh'] }

    for restaurant, keywords in filters.items():
        for keyword in keywords:
            filter_foods(restaurant, keyword)


    return data

if __name__ == "__main__":
    pprint(restaurants())
    data = restaurants()
    pprint(data['tuas'])
