#!/bin/sh

tokenFile='/tmp/WALLBLOG'

if grep -Fxq "UPDATE" $tokenFile
then
    echo "\n\n[Updating wallblog] `date '+%F-%T'`\n"
    cd ~/projects/wallblog
    git pull origin master
    /usr/local/bin/composer install
    npm install
    npm run package
    echo "DONE" > $tokenFile
fi
