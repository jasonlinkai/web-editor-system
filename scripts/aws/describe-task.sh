ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

echo "task id: $1"

aws ecs descirbe-tasks
  --cluster $CLUSTER_NAME \
  --task $$1