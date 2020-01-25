#!/usr/bin/python3
import requests
from PIL import Image, ImageStat
import subprocess
from datetime import datetime

def get_brightness():
    url = "https://www.athene.fi/olocam/latest.jpg"
    img = Image.open(requests.get(url, stream=True).raw)
    brightness = ImageStat.Stat(img).mean[0]
    return brightness

def power(state):
    subprocess.run(['cec-client', '-s', '-d', '1'], input=('on 0' if state else 'standby 0').encode(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)

def is_day():
    hour = datetime.now().hour
    return hour > 7 and hour < 20

if not is_day() and get_brightness() < 50:
    power(0)
else:
    power(1)
