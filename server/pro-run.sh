#!/bin/bash
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

export IMAGE_NAME=prod-web-editor-server
export CONTAINER_NAME=prod-web-editor-server-container
export HOST_PORT=3001
export CONTAINER_PORT=3001

sh ./run.sh
