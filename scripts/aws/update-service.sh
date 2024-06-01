ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

aws ecs update-service \
  --region $REGION \
  --cluster $CLUSTER_NAME \
  --task-definition $TASK_DEFINITION_NAME \
  --service $SERVICE_NAME \
  --enable-execute-command \
  --force-new-deployment
