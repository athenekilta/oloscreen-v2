import requests
from bs4 import BeautifulSoup

subway_url = "http://www.subway.fi/fi/ravintolat/espoo/espoo-otaniemi"

weekdays = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su']


def get_opening_hours():
    response = requests.get(subway_url)
    html = response.text
    soup = BeautifulSoup(html, 'html.parser')
    elements = soup.find('div', class_='restaurants_content').find('table').findAll('td')
    opening_hours = []
    for element in elements:
        if element.text.strip().rstrip(':') in weekdays:
            continue
        opening_hours.append( element.text.strip() )
    return opening_hours
