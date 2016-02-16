#!/bin/sh

tokenFile='/tmp/WALLBLOG'

if grep -Fxq "UPDATE" $tokenFile
then
    echo "[Updating wallblog] `date '+%F-%T'`\n"
    cd ~/wallblog
    git pull
    npm run package
    echo "DONE" > $tokenFile
fi
