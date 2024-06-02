ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi
ENV_FILE=./scripts/aws/.env.aws.local

# set workdir to project root
cd ../../

echo "stage: login aws ecr docker hub..."
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 668605093993.dkr.ecr.us-east-1.amazonaws.com

echo "stage: clear docker builder cache..."
docker builder prune --all --force

echo "stage: shout down docker containers..."
docker-compose --env-file $ENV_FILE  down -v

echo "stage: remove old images..."
docker image rm web-editor-system-database
docker image rm web-editor-system-client
docker image rm web-editor-system-server
docker image rm 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-database
docker image rm 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-client
docker image rm 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-server

echo "stage: build docker containers..."
docker-compose --env-file $ENV_FILE  build --no-cache

echo "stage: run docker containers..."
docker-compose --env-file $ENV_FILE  up -d

echo "stage: tag images for pushing to aws ecr with right tag..."
docker tag web-editor-system-database:latest 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-database:latest
docker tag web-editor-system-client:latest 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-client:latest
docker tag web-editor-system-server:latest 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-server:latest

echo "stage: push images to ecr..."
docker push 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-database:latest
docker push 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-client:latest
docker push 668605093993.dkr.ecr.us-east-1.amazonaws.com/web-editor-system-server:latest

# echo "stage: set workdir back to scripts/aws..."
cd ./scripts/aws