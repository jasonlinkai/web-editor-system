#!/bin/bash
if [ -f .env ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

export IMAGE_NAME=dev-web-editor-database
export CONTAINER_NAME=dev-web-editor-database-container
export HOST_PORT=3906
export CONTAINER_PORT=3306
export DATA_VOLUME=dev-web-editor-database-container-data-volume

sh ./run.sh
