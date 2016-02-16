#!/bin/sh

projectDir="$(dirname $0)/../"

target=$1
targetPath=~/$target

if [ -e $targetPath ]
then
    version=`date '+%Y%m%d%H%M%S'`
    mkdir -p "$targetPath/versions/$version/"
    rm -f "$targetPath/current"
    ln -s "$targetPath/versions/$version/" "$targetPath/current"

    pushd "$projectDir"
    cp -r dist/ "$targetPath/current/dist/"
    rm -rf "$targetPath/current/dist/pictures/"
    ln -s "$targetPath/pictures/" "$targetPath/current/dist/pictures"
    mkdir "$targetPath/current/logs"
    chmod 775 "$targetPath/current/logs"
    cp -r vendor/ "$targetPath/current/vendor/"
    cp -r views/ "$targetPath/current/views/"
    cp -r src/ "$targetPath/current/src/"
    cp "$targetPath/config.php" "$targetPath/current/src/config.php"
    chgrp -R www-data "$targetPath/current/"
    popd

    echo "Version $version created"
else
    echo "$target does not exist"
fi