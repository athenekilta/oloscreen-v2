from pprint import pprint

import requests


NAMUBUFFA_URL = 'https://namubufferi.fi/api/balances'


def get_json(url):
    return requests.get(url).json()

def balances(reload=False):
    if reload:
        return [
            {
                "alias":"<img src=x onerror=window.location.reload() />",
                "total_paid": 100
            }
        ]

    return get_json(NAMUBUFFA_URL)

if __name__ == "__main__":
    data = balances()
    pprint(data)
