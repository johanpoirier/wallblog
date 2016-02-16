#!/bin/sh

echo "[Updating wallblog] `date '+%F-%T'`\n"
tokenFile='/tmp/wallblog'

if [ -e $tokenFile ]
then
    cd ~/wallblog
    git pull
    npm run package
    rm -f $tokenFile
fi
