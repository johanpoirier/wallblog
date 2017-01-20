#!/bin/bash

IMAGE_NAME='wallblog'
CID_FILE="/tmp/${IMAGE_NAME}.cid"
SCRIPT_DIR=$(dirname "$0")
WORKSPACE=`pwd`/..
DOCKER_WORKSPACE='/var/www/wallblog'


docker rm -f -v "$IMAGE_NAME" > /dev/null 2>&1
rm -f "$CID_FILE"

echo "Running docker container"
docker run -d --cidfile="$CID_FILE" -v "${WORKSPACE}":${DOCKER_WORKSPACE}:rw -w ${DOCKER_WORKSPACE} --name $IMAGE_NAME $IMAGE_NAME
echo ""

while [ ! -f "$CID_FILE" ]
do
  sleep 1
done

CONTAINER_ID=$(cat "$CID_FILE")
CONTAINER_IP=$(docker inspect --format '{{ .NetworkSettings.IPAddress }}' $CONTAINER_ID)

echo "Wallblog will be available at http://${CONTAINER_IP}"
echo " -> credentials for uploading pictures: wall@blog.fr / toto"
echo ""

echo "Installing dependencies:"
docker exec $IMAGE_NAME ${DOCKER_WORKSPACE}/docker/wallblog.sh
echo "Done."

docker exec $IMAGE_NAME git config --global user.email "`git config --global user.email`"
docker exec $IMAGE_NAME git config --global user.name "`git config --global user.name`"
