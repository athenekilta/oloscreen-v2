import requests
from pprint import pprint


NAMUBUFFA_URL = 'https://namubufferi.fi/api/balances'


def get_json(url):
    return requests.get(url).json()

def balances():
    data = get_json(NAMUBUFFA_URL)

    return data

if __name__ == "__main__":
    data = balances()
    pprint(data)
