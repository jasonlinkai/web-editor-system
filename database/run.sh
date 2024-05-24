# Step 1: Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME \
    --build-arg MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD \
    --build-arg MYSQL_DATABASE=$MYSQL_DATABASE \
    --build-arg MYSQL_USER=$MYSQL_USER \
    --build-arg MYSQL_PASSWORD=$MYSQL_PASSWORD .

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
docker run -d -p $HOST_PORT:$CONTAINER_PORT --name $CONTAINER_NAME -v $DATA_VOLUME:/var/lib/mysql $IMAGE_NAME

echo "Docker container is up and running!"
