#!/bin/bash

IMAGE_NAME='wallblog'
CID_FILE="/tmp/$IMAGE_NAME.cid"
SCRIPT_DIR=$(dirname "$0")

rm -f "$CID_FILE"
docker run -d --cidfile="$CID_FILE" -v "$WORKSPACE/ecommerce/":/var/www/ecommerce/current:rw -w /var/www/ecommerce/current --name $IMAGE_NAME $IMAGE_NAME

while [ ! -f "$CID_FILE" ]
do
  sleep 1
done

CONTAINER_ID=$(cat "$CID_FILE")
CONTAINER_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $CONTAINER_ID)

echo "Go to  ${CONTAINER_IP} to test wallblog"
