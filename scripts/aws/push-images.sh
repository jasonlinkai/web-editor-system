ENV_FILE=./scripts/aws/.env.aws.local

# set workdir to project root
cd ../../

aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 668605093993.dkr.ecr.us-east-1.amazonaws.com

docker builder prune --all --force

docker-compose --env-file $ENV_FILE  down -v

docker image rm web-editor-system-database
docker image rm web-editor-system-client
docker image rm web-editor-system-server
docker image rm 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-database
docker image rm 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-client
docker image rm 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-server

docker-compose --env-file $ENV_FILE  build --no-cache
docker-compose --env-file $ENV_FILE  up -d

docker tag web-editor-system-database:latest 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-database:latest
docker tag web-editor-system-client:latest 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-client:latest
docker tag web-editor-system-server:latest 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-server:latest

docker push 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-database:latest
docker push 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-client:latest
docker push 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-server:latest

# set workdir back to scripts/aws 
cd ./scripts/aws