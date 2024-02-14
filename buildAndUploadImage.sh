docker build -t aiot-mw-api:latest .

docker tag aiot-mw-api:latest aiblabco/aiot-mw-api:latest

docker push aiblabco/aiot-mw-api:latest
