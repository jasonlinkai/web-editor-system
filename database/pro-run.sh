#!/bin/bash
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

export IMAGE_NAME=prod-web-editor-database
export CONTAINER_NAME=prod-web-editor-database-container
export HOST_PORT=3906
export CONTAINER_PORT=3306
export DATA_VOLUME=prod-web-editor-database-container-data-volume

sh ./run.sh
