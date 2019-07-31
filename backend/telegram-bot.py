import telegram
import files
from telegram.error import NetworkError, Unauthorized
from time import sleep

bot_name = "oloscreenbot"
help_text = "Lähetä botille viesti. Se saattaa näkyä Oloscreenillä."
help_commands = ["/start", "/help", "/helppikset", "/helppistä"]
help_commands += [item + "@" + bot_name for item in help_commands]

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
                    else:
                        update.message.reply_text("✅ checkistä!")
                        files.write_to_queue(update.message.text)
                else:
                    update.message.reply_text("Nyt pistit liian pahan :( ")

    except Unauthorized:
        # The user has removed or blocked the bot.
        update_id += 1
    except NetworkError:
        sleep(10)
