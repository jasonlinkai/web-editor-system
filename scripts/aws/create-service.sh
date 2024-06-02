ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

echo "service name: $1"
echo "task definition name: $2"

aws ecs create-service \
  --cluster $CLUSTER_NAME \
  --service-name $1 \
  --task-definition $2 \
  --desired-count 1 \
  --launch-type FARGATE \
  --enable-execute-command \
  --no-cli-pager \
  --network-configuration "awsvpcConfiguration={subnets=$SUBNET_IDS,securityGroups=$SECURITY_GROUP_IDS,assignPublicIp=ENABLED}"

