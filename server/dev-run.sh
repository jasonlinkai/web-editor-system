#!/bin/bash
if [ -f .env ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

export IMAGE_NAME=dev-web-editor-server
export CONTAINER_NAME=dev-web-editor-server-container
export HOST_PORT=3001
export CONTAINER_PORT=3001

sh ./run.sh
