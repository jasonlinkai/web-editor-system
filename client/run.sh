# Step 1: Build the Docker image
echo "Building the Docker image..."
docker build -t $IMAGE_NAME \
    --build-arg REACT_APP_API_URL=$REACT_APP_API_URL \
    --build-arg REACT_APP_CDN_URL=$REACT_APP_CDN_URL .

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
