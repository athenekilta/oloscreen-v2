from pathlib import Path

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
        with open(str(Path.home()) + "/.oloscreen-telegram-token.txt", "r") as tokenfile:
            return tokenfile.read().strip()
    except Exception as e:
        print("Couldn't read Telegram bot token from ~/.oloscreen-telegram-token.txt (where ~ is current users home directory)")
        raise e
