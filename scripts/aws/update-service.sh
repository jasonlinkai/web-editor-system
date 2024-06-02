ENV_FILE=.env.ecs.local
if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

echo "service name: $1"
echo "task definition name: $2"

aws ecs update-service \
  --region $REGION \
  --cluster $CLUSTER_NAME \
  --task-definition $2 \
  --service $1 \
  --enable-execute-command \
  --force-new-deployment \
  --no-cli-pager
