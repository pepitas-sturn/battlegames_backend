#!/bin/bash

#docker container stop
docker container stop llm-games

#docker container remove
docker container rm llm-games

#docker image remove
docker image rm ataur39n/llm-games:main

#docker new image pull
docker pull ataur39n/llm-games:main

#docker run the image
docker run -d --name llm-games \
  -p 9000:9000 \
  -e REDIS_HOST=31.14.40.208 \
  -e REDIS_PORT=10001 \
  -e REDIS_PASSWORD=@admin123 \
  ataur39n/llm-games:main
