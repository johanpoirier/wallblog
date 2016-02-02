#!/bin/bash

IMAGE_NAME='wallblog'

docker exec $IMAGE_NAME gulp package
echo "Packaged Wallblog is available in dist/ folder"
