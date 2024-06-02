source getEnv.sh $1

aws ecs create-service \
  --cluster $CLUSTER_NAME \
  --service-name $SERVICE_NAME \
  --task-definition $SERVICE_TASK_DEFINITION \
  --desired-count 1 \
  --launch-type FARGATE \
  --enable-execute-command \
  --no-cli-pager \
  --network-configuration "awsvpcConfiguration={subnets=$SUBNET_IDS,securityGroups=$SECURITY_GROUP_IDS,assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=$SERVICE_TARGET_GROUP_ARN,containerName=$SERVICE_CONTAINER_NAME,containerPort=$SERVICE_CONTAINER_PORT"
