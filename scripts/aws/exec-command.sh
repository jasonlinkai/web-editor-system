source getEnv.sh $1

# 檢查參數是否存在
if [ -z "$2" ]; then
    echo "參數不存在, TASK_ID: sh xxxxxx.sh <container_name> <task_id>"
    exit 1  # 結束腳本執行，返回錯誤碼1
fi

echo "task id: $2"

COMMAND="/bin/sh"

aws ecs execute-command  \
  --region $REGION \
  --cluster $CLUSTER_NAME \
  --task $1 \
  --container $SERVICE_NAME \
  --command $COMMAND \
  --interactive