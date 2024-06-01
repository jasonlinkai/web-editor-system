ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

aws ecs create-service \
  --cluster $CLUSTER_NAME \
  --service-name $SERVICE_NAME \
  --task-definition $TASK_DEFINITION_NAME \
  --desired-count 1 \
  --launch-type FARGATE \
  --enable-execute-command \
  --network-configuration "awsvpcConfiguration={subnets=$SUBNET_IDS,securityGroups=$SECURITY_GROUP_IDS,assignPublicIp=ENABLED}"

