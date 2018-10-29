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

    # release directory
    mkdir -p "$targetPath/versions/$version/"
    rm -f "$targetPath/current"
    ln -s "$targetPath/versions/$version/" "$targetPath/current"

    cd "$projectDir"

    # build
    git pull origin master
    /usr/local/bin/composer install --no-dev --optimize-autoloader
    cp "$projectDir/config.json" "$projectDir/config.sample.json"
    cp "$targetPath/config.json" "$projectDir/config.json"
    cp "$projectDir/app/manifest.json" "$projectDir/app/manifest.sample.json"
    cp "$targetPath/manifest.json" "$projectDir/app/manifest.json"
    npm install
    npm run package

    # copy files
    cp -r dist/ "$targetPath/current/dist/"
    rm -rf "$targetPath/current/dist/pictures/"
    ln -s "$targetPath/pictures/" "$targetPath/current/dist/pictures"
    mkdir "$targetPath/current/logs"
    chmod 775 "$targetPath/current/logs"
    cp -r bin/ "$targetPath/current/bin/"
    cp -r config/ "$targetPath/current/config/"
    cp -r src/ "$targetPath/current/src/"
    cp -r templates/ "$targetPath/current/templates/"
    cp -r vendor/ "$targetPath/current/vendor/"
    cp "$targetPath/config.json" "$targetPath/current/config.json"
    cp "$targetPath/.env" "$targetPath/current/.env"
    chgrp -R www-data "$targetPath/current/"

    # Google analytics script
    if [ $analytics = 0 ]
    then
        rm "$targetPath/current/dist/analytics.js"
    fi

    mv "$projectDir/config.sample.json" "$projectDir/config.json"
    mv "$projectDir/app/manifest.sample.json" "$projectDir/app/manifest.json"
    cd --

    # Clear cache
    pushd "$targetPath/versions/$version/"
    php bin/console cache:clear --env=prod --no-debug
    popd

    echo "Version $version created"
else
    echo "$target does not exist"
fi
