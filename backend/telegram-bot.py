import telegram
import files
import requests
from telegram.error import NetworkError, Unauthorized, RetryAfter
from time import sleep

bot_name = "oloscreenbot"
help_text = "Lähetä botille viesti. Se saattaa näkyä Oloscreenillä."
help_commands = ["/start", "/help", "/helppikset", "/helppistä"]
help_commands += [item + "@" + bot_name for item in help_commands]


def main():
    # Start the bot
    update_id = None
    bot = telegram.Bot(files.read_token())
    while True:
        try:
            for update in bot.getUpdates(offset=update_id, timeout=10):
                update_id = update.update_id + 1
                if update.message is None:
                    continue
                chat_id = update.message.chat_id
                if update.message:
                    if update.message.text:
                        if update.message.text.lower() in help_commands:
                            update.message.reply_text(help_text)
                        elif update.message.text.lower() == "/ip":
                            try:
                                update.message.reply_text(requests.get("https://ipv6.zah.fi/").text)
                            except:
                                update.message.reply_text("O-ou, pieleen meni")
                        else:
                            update.message.reply_text("✅ checkistä!")
                            files.write_to_queue(update.message.text)
                    else:
                        update.message.reply_text("Nyt pistit liian pahan :( ")

        except Unauthorized:
            # The user has removed or blocked the bot.
            update_id += 1
        except NetworkError:
            sleep(60)
        except RetryAfter as e:
            sleep(e.retry_after)
        


if __name__ == "__main__":
    main()
