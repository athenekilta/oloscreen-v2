# Oloscreen 2
This software is used in Athene's guild room's information screen.
## Installation & usage
Clone the repository and cd into it.

```bash
git clone https://github.com/athenekilta/oloscreen-v2.git
cd oloscreen-v2/
```

You must place a `.env` file in the root directory. Its contents should be something like this:
```bash
OLOSCREEN_TELEGRAM_TOKEN=your_telegram_bot_token
```

### Using docker
There are no separate dev/prod docker configurations.

```bash
docker-compose up
```
And after making changes, it is best to shut down current docker-compose (try pressing ctrl-c a few times) and run these commands:
```bash
docker-compose rm   # answer y when prompted
docker-compose build
docker-compose up
```

### Without docker
```
cd backend
./setup.sh
```

Change directory back to project root of the project. Opening tmux or screen might help here.
#### Startup script
There's a startup script that starts the commands described below under manual starting.
In project folder run:
```
./oloscreen.sh
```
#### Manual startup
If `./oloscreen.sh` doesn't work, you can try starting everything manually:
```
cd backend
./start.sh
```
```
python3 telegram-bot.py
```
