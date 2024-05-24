#!/bin/bash
if [ -f .env ]; then
  export $(grep -v '^#' .env.local | xargs)
fi

sh ./run.sh
