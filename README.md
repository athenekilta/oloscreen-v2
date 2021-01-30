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

You must first create a production version of the react app.
The file [docker-compose-build.yml](./docker-compose-build.yml) is used with docker-compose to produce needed static files.
After that you can spin up the actual container.
```bash
docker-compose --file docker-compose-build.yml up
docker-compose up
```
And after making changes, it is best to shut down current docker-compose (try pressing ctrl-c a few times) and run these commands:
```bash
docker-compose --file docker-compose-build.yml up
docker-compose rm   # answer y when prompted
docker-compose build
docker-compose up
```

### Without docker (not recommended)
It is possible to start the system without using docker, but it is not recommended and these instructions might not work. **As docker is currently the primary way to run Oloscreen, the source code is modified so that it probably won't run without docker (or nginx without docker) if the source code is not changed.**
```
npm install
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
npm start
cd backend
./start.sh
```
```
python3 telegram-bot.py
```
