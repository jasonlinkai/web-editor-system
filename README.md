# web-editor.js

## Introduce
This is a full-stack online react web creator.

## Run

### Use docker-compose with .env file to run all services.
```sh
docker-compose --env-file .env  up -d
```

### Use dockerfile with .env file to run service singliy.
```sh
# in client, database, server folder.

# use .env.local and dockerfile to create container.
sh dev-run.sh
# use .env and dockerfile to create container.
sh pro-run.sh
```

### Run services locally.
```sh
#
# client
#
yarn dev
yarn scss

#
# server
#
yarn dev
```