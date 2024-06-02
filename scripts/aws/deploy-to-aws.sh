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

# check ecs service exist.
check_ecs_service() {
  cluster_name=$1
  service_name=$2
  service_exists=$(aws ecs describe-services --cluster "$cluster_name" --services "$service_name" --query 'services[0].serviceName' --output text)
  if [ "$service_exists" == "$service_name" ]; then
    echo "Service $service_name exists in cluster $cluster_name."
    return 0
  else
    echo "Service $service_name does not exist in cluster $cluster_name."
    return 1
  fi
}

# server
check_ecs_service $CLUSTER_NAME $SERVER_SERVICE_NAME
if [ $? -eq 0 ]; then
  echo "Performing an action because the service exists..."
  echo "stage: update server service..."
  sh update-service.sh web-editor-system-server-service web-editor-system-server
else
  echo "No action taken because the service does not exist."
  echo "stage: create client service..."
  sh create-service.sh web-editor-system-server-service web-editor-system-server
fi

# client
check_ecs_service $CLUSTER_NAME $CLIENT_SERVICE_NAME
if [ $? -eq 0 ]; then
  echo "Performing an action because the service exists..."
  echo "stage: update client service..."
  sh update-service.sh web-editor-system-client-service web-editor-system-client
else
  echo "No action taken because the service does not exist."
  echo "stage: create client service..."
  sh create-service.sh web-editor-system-client-service web-editor-system-client
fi


