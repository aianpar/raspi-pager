import sys
import os
import textwrap
picdir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'pic')
import logging
import time
import requests
from PIL import Image, ImageDraw, ImageFont
import traceback
from lib.waveshare_epd import epd2in13_V4
from lib.pisugar._init import *
from datetime import datetime
import pytz
from dotenv import load_dotenv


load_dotenv()
DOMAIN = os.getenv("DOMAINAPI")

logging.basicConfig(level=logging.DEBUG)

##### battery status
conn, event_conn = connect_tcp('127.0.0.1',8423)
s = PiSugarServer(conn, event_conn)



def get_battery_status():
    try:
        battery = int(s.get_battery_level())  # Get battery percentage
        return battery
    except Exception as e:
        print("Error fetching battery status:", e)
        return "N/A"
############

current_message_index = -1
is_new_message = False
messages = []

####### get message from api
def get_message():
    
    try:
        response = requests.get(DOMAIN)
        data = response.json()
        return data
    except Exception as e:
        print("Error fetching message:", e)
        return "N/A"
    
###### Update the screen eink with partial updates
    
def update_screen(is_new_message):
        global current_message_index
        shown_message = messages[current_message_index]
        battery = get_battery_status()
        testimg = Image.open(os.path.join(picdir, f'{shown_message["image_id"]}.png'))
        timestamp = shown_message["created_at"]
        messagetime = datetime.fromisoformat(timestamp.replace("Z", "+00:00"))
        toronto_tz = pytz.timezone('America/Toronto') ### change this to your timezone <---
        messagetime = messagetime.astimezone(toronto_tz)
        formatted_time = messagetime.strftime('%m/%d %H:%M')

        
        draw.rectangle((1, 1, 40, 20), fill = 255)
        draw.rectangle((50, 1, 200, 20), fill = 255)

        draw.rectangle((100, 5, 250, 20), fill = 255)


        # draw.rectangle((1, 40, 25, 140), fill = 0)

        image.paste(testimg, (5, 5))
        draw.text((5, 5), time.strftime('%H:%M'), fill = 0)
        if is_new_message == False:
            draw.text((50, 5), "[No Internet]", fill = 0)
        elif current_message_index == -1 or current_message_index == len(messages) - 1:
            draw.text((50, 5), "[New Message]", fill = 0)
        else:
            draw.text((50, 5), "[Previous Message]", fill = 0)

        draw.text((160, 5), f'Battery: {battery} %', fill = 0)

        # refreshes the text
        draw.rectangle((130, 40, 250, 140), fill =255)


        wrapped_text = textwrap.fill(shown_message["message"], width=19)
        lines = wrapped_text.split('\n')
        y_text = 40
        for line in lines:
            draw.text((130, y_text), line, fill=0)
            y_text += 15  


        draw.text((175, 90), f'from: {shown_message["sender"]}', fill = 0)
        draw.text((175, 105), formatted_time, fill = 0)


        epd.displayPartial(epd.getbuffer(image))

def tap_handler():
    global current_message_index
    if messages:
        current_message_index = (current_message_index - 1) % len(messages)
        update_screen(is_new_message)
        print(f'current_message_index {current_message_index}')


s.register_single_tap_handler(lambda: tap_handler())


try:
    epd = epd2in13_V4.EPD()
    epd.init()
    epd.Clear(0xFF)
    epd.init()

    logging.info("E-paper Initialized")

    image = Image.new('1', (epd.height, epd.width), 255) # 255: clear the frame
    draw = ImageDraw.Draw(image)
    epd.displayPartBaseImage(epd.getbuffer(image))



    #### Drawing on the image
    while True:
        new_messages = get_message()

        if new_messages == "N/A":
            is_new_message = False
            logging.info("Failed to fetch messages. Retrying in 60 seconds...")
            draw.rectangle((50, 1, 200, 20), fill = 255)
            draw.text((50, 5), "[No Internet]", fill = 0)
            epd.displayPartial(epd.getbuffer(image))
            time.sleep(60)
            continue
        else:
            is_new_message = True
        
        if len(new_messages) >= 5:
            messages = new_messages[-5:]
              # Keep only the last two messages
        else:
            messages = new_messages
        update_screen(is_new_message)
        
        current_message_index = -1
        time.sleep(60)




except IOError as e:
    logging.info(e)

except KeyboardInterrupt:    
    logging.info("ctrl + c:")
    epd2in13_V4.epdconfig.module_exit()
    exit()

finally:
    epd.Clear(0xFF)
    epd2in13_V4.epdconfig.module_exit(cleanup=True)


