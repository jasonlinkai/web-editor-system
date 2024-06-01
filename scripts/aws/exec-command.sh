ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

CONTAINER_NAME=client
COMMAND="/bin/sh"

aws ecs execute-command  \
  --region $REGION \
  --cluster $CLUSTER_NAME \
  --task $TASK_ID \
  --container $CONTAINER_NAME \
  --command $COMMAND \
  --interactive