#!/bin/sh

tokenFile='/tmp/WALLBLOG'

if [ -e $tokenFile ]
then
    echo "[Updating wallblog] `date '+%F-%T'`\n"
    cd ~/wallblog
    git pull
    npm run package
    rm -f $tokenFile
fi
