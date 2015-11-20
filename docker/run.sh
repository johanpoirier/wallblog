#!/bin/bash

IMAGE_NAME='wallblog'
CID_FILE="/tmp/${IMAGE_NAME}.cid"
SCRIPT_DIR=$(dirname "$0")
WORKSPACE=`pwd`/..
DOCKER_WORKSPACE='/var/www/wallblog'
GULP_LOG="${DOCKER_WORKSPACE}/logs/gulp.log"


rm -f "$CID_FILE"

echo "Running docker container"
docker run -d --cidfile="$CID_FILE" -v "${WORKSPACE}":${DOCKER_WORKSPACE}:rw -w ${DOCKER_WORKSPACE} --name $IMAGE_NAME $IMAGE_NAME
echo ""

while [ ! -f "$CID_FILE" ]
do
  sleep 1
done

echo "Building wallblog app:"
docker exec $IMAGE_NAME ${DOCKER_WORKSPACE}/docker/wallblog.sh
echo "Done."
echo ""

CONTAINER_ID=$(cat "$CID_FILE")
CONTAINER_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $CONTAINER_ID)

echo "Go to http://${CONTAINER_IP} to test wallblog"