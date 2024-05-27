#!/bin/bash
if [ -f .env ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

export IMAGE_NAME=dev-web-editor-client
export CONTAINER_NAME=dev-web-editor-client-container
export HOST_PORT=3000
export CONTAINER_PORT=80

sh ./run.sh
