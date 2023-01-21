from bs4 import BeautifulSoup as bs
import requests

def get_all_logo_links():
    req = requests.get('https://athene.fi', timeout=10)
    soup = bs(req.text)
    sponsor_items = soup.find_all('li', {'class': 'sponsors-item'})

    # Parse list of images into a list of img src links
    links = [x.img.attrs['src'] for x in sponsor_items]

    return links