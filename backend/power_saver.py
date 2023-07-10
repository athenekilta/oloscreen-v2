#!/usr/bin/python3
import requests
from PIL import Image, ImageStat
import subprocess
from datetime import datetime

def get_brightness():
    url = "https://www.athene.fi/olocam/latest.jpg"
    basic = requests.auth.HTTPBasicAuth('', '')
    img = Image.open(requests.get(url, stream=True, auth=basic).raw)
    brightness = ImageStat.Stat(img).mean[0]
    return brightness

def power(state):
    subprocess.run(['cec-client', '-s', '-d', '1'], input=('on 0' if state else 'standby 0').encode(), stdout=subprocess.PIPE, stderr=subprocess.PIPE)

def is_day():
    hour = datetime.now().hour
    return hour > 7 and hour < 20

action = ""
brightness = get_brightness()
if not is_day() and brightness < 50:
    power(0)
    action = "Off"
else:
    power(1)
    action = "On"

with open('/home/pi/powersaver_log.txt', 'a') as f:
    f.write("{}: {}, {}, {}\n".format(datetime.now().strftime('%d.%m %H:%M'),action, int(brightness), is_day()))
