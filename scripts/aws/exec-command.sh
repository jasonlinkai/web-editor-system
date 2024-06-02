ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

echo "task id: $1"
echo "container name: $2"

COMMAND="/bin/sh"

aws ecs execute-command  \
  --region $REGION \
  --cluster $CLUSTER_NAME \
  --task $1 \
  --container $2 \
  --command $COMMAND \
  --interactive