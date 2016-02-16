#!/bin/sh

tokenFile='/tmp/WALLBLOG'

if grep -Fxq "UPDATE" $tokenFile
then
    echo "[Updating wallblog] `date '+%F-%T'`\n"
    cd ~/wallblog
    git pull origin master
    npm install
    npm run package
    echo "DONE" > $tokenFile
fi
