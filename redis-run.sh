#!/bin/bash

docker run -d --name redis-stack \
  -p 10001:6379 -p 10002:8001 \
  -v redis_data:/data \
  -e REDIS_ARGS="--requirepass @admin123" \
  redis/redis-stack:latest
