## development

### up
```sh
docker-compose --env-file=.env.local up -d &&  sleep 10 && cd server && yarn sync-database && cd ..
```

### down
```sh
docker-compose --env-file=.env.local down -v
```