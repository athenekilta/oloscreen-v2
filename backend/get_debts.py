import requests
from pprint import pprint


NAMUBUFFA_URL = 'https://namubufferi.fi/api/debts'


def get_json(url):
    return requests.get(url).json()

def debts():
    data = get_json(NAMUBUFFA_URL)

    return data

if __name__ == "__main__":
    data = debts()
    pprint(data)
