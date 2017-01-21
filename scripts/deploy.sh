#!/bin/sh

projectDir="$(dirname $0)/../"

analytics=0
while getopts "a" option
do
    case $option in
        a)
            echo "Adding analytics.js"
            analytics=1
            ;;
    esac
done

target=${@: -1}
targetPath=~/$target

if [ -e $targetPath ]
then
    version=`date '+%Y%m%d%H%M%S'`
    mkdir -p "$targetPath/versions/$version/"
    rm -f "$targetPath/current"
    ln -s "$targetPath/versions/$version/" "$targetPath/current"

    cd "$projectDir"
    cp -r dist/ "$targetPath/current/dist/"
    rm -rf "$targetPath/current/dist/pictures/"
    ln -s "$targetPath/pictures/" "$targetPath/current/dist/pictures"
    mkdir "$targetPath/current/logs"
    chmod 775 "$targetPath/current/logs"
    cp -r vendor/ "$targetPath/current/vendor/"
    cp -r views/ "$targetPath/current/views/"
    cp -r src/ "$targetPath/current/src/"
    cp "$targetPath/config.php" "$targetPath/current/src/config.php"
    cp "$targetPath/config.json" "$targetPath/current/config.json"
    chgrp -R www-data "$targetPath/current/"
    if [ $analytics = 0 ]
    then
        rm "$targetPath/current/dist/analytics.js"
    fi
    cd --

    echo "Version $version created"
else
    echo "$target does not exist"
fi