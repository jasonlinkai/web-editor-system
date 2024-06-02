ENV_FILE=.env.ecs.local
SERVER_ENV_FILE=.env.ecs.server.local
CLIENT_ENV_FILE=.env.ecs.client.local

if [ -f $ENV_FILE ]; then
  export $(grep -v '^#' $ENV_FILE | xargs)
fi

# 檢查參數是否存在
if [ -z "$1" ]; then
    echo "參數不存在: sh getEnv.sh [server | client]"
    exit 1  # 結束腳本執行，返回錯誤碼1
fi

if [ $1 = "server" ]; then
  echo "=========is server========="
  if [ -f $SERVER_ENV_FILE ]; then
    export $(grep -v '^#' $SERVER_ENV_FILE | xargs)
  fi
fi

if [ $1 = "client" ]; then
  echo "=========is client========="
    if [ -f $CLIENT_ENV_FILE ]; then
    export $(grep -v '^#' $CLIENT_ENV_FILE | xargs)
  fi
fi

echo "SERVICE_NAME=$SERVICE_NAME"
echo "SERVICE_TASK_DEFINITION=$SERVICE_TASK_DEFINITION"
echo "SERVICE_CONTAINER_NAME=$SERVICE_CONTAINER_NAME"
echo "SERVICE_CONTAINER_PORT=$SERVICE_CONTAINER_PORT"
echo "SERVICE_LOAD_BALANCER_NAME=$SERVICE_LOAD_BALANCER_NAME"
echo "SERVICE_TARGET_GROUP_ARN=$SERVICE_TARGET_GROUP_ARN"