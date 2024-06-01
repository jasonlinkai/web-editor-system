ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

aws ecs descirbe-tasks
  --cluster $CLUSTER_NAME \
  --task $TASK_ID