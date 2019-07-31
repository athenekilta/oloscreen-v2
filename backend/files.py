from pathlib import Path
import os
from dotenv import load_dotenv
load_dotenv()


def write_to_queue(message):
    message = message.replace("\n", " ").strip() + "\n"
    messages = []
    try:
        with open("telegram-messages.txt", "r") as messagefile:
            messages = list(messagefile)
            if (len(messages) > 4):
                messages = messages[-4:]
            messages.append(message)
        messages_string = "".join(messages)
        with open("telegram-messages.txt", "w") as messagefile:
            messagefile.write(messages_string)

    except FileNotFoundError:
        with open("telegram-messages.txt", "x") as messagefile:
            pass
        write_to_queue(message)


def read_token():
    try:
        return os.environ['OLOSCREEN_TELEGRAM_TOKEN']
    except KeyError:
        raise Exception(
            "Couldn't read Telegram bot token from env OLOSCREEN_TELEGRAM_TOKEN")
