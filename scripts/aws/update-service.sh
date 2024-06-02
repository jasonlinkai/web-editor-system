source getEnv.sh $1

aws ecs update-service \
  --region $REGION \
  --cluster $CLUSTER_NAME \
  --task-definition $SERVICE_TASK_DEFINITION \
  --service $SERVICE_NAME \
  --enable-execute-command \
  --force-new-deployment \
  --no-cli-pager
