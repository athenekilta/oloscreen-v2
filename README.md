# Oloscreen 2
This software is used in Athene's guild room's information screen.
## Installation
Clone the repository.
```git clone https://github.com/athenekilta/oloscreen-v2.git```
Set it all up
```
npm install
cd backend
./setup.py
```
## Usage
Change directory back to project root of the project. Opening tmux or screen might help here.
### Startup script
There's a startup script that starts the commands described below under manual starting.
In project folder run:
```
./oloscreen.sh
```
### Manual startup
If `./oloscreen.sh` doesn't work, you can try starting everything manually:
```
npm start
```
And then
```
cd backend
```
On backend run
```
./start.sh
```
```
python3 telegram-bot.py
```
