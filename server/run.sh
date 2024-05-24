# Step 1: Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME \
    --build-arg MYSQL_DATABASE_HOST=$MYSQL_DATABASE_HOST \
    --build-arg MYSQL_DATABASE_PORT=$MYSQL_DATABASE_PORT \
    --build-arg MYSQL_DATABASE_DATABASE=$MYSQL_DATABASE_DATABASE \
    --build-arg MYSQL_DATABASE_USERNAME=$MYSQL_DATABASE_USERNAME \
    --build-arg MYSQL_DATABASE_PASSWORD=$MYSQL_DATABASE_PASSWORD \
    --build-arg AWS_ACCESS_KEY_ID=$AWS_ACCESS_KEY_ID \
    --build-arg AWS_SECRET_ACCESS_KEY=$AWS_SECRET_ACCESS_KEY \
    --build-arg AWS_SECRET_REGION=$AWS_SECRET_REGION \
    --build-arg GOOGLE_OAUTH2_SECRET=$GOOGLE_OAUTH2_SECRET \
    --build-arg GOOGLE_OAUTH2_CLIENT_ID=$GOOGLE_OAUTH2_CLIENT_ID \
    --build-arg JWT_SECRET=$JWT_SECRET \
    --build-arg CLIENT_URL=$CLIENT_URL \
    --build-arg SERVER_HOST=$SERVER_HOST \
    --build-arg PORT=$PORT .

# Step 2: Check if a container with the same name is already running and stop it
if [ "$(docker ps -q -f name=$CONTAINER_NAME)" ]; then
    echo "Stopping the existing container..."
    docker stop $CONTAINER_NAME
fi

# Step 3: Remove the existing container if it exists
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
    echo "Removing the existing container..."
    docker rm $CONTAINER_NAME
fi

# Step 4: Run the Docker container with a volume
echo "Running the Docker container..."
docker run -d -p $HOST_PORT:$CONTAINER_PORT --name $CONTAINER_NAME $IMAGE_NAME

echo "Docker container is up and running!"
