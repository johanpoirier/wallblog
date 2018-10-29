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
    targetReleasePath="$targetPath/versions/$version"
    mkdir -p ${targetReleasePath}

    cd "$projectDir"

    # build
    git pull origin master
    cp "$projectDir/config.json" "$projectDir/config.sample.json"
    cp "$targetPath/config.json" "$projectDir/config.json"
    cp "$projectDir/app/manifest.json" "$projectDir/app/manifest.sample.json"
    cp "$targetPath/manifest.json" "$projectDir/app/manifest.json"
    npm install
    npm run package

    # copy files
    cp -r dist/ "${targetReleasePath}/dist/"
    rm -rf "${targetReleasePath}/dist/pictures/"
    ln -s "$targetPath/pictures/" "${targetReleasePath}/dist/pictures"
    mkdir "${targetReleasePath}/var"
    chmod 770 "${targetReleasePath}/var"
    cp composer.* "${targetReleasePath}/"
    cp symfony.* "${targetReleasePath}/"
    cp -r bin/ "${targetReleasePath}/bin/"
    cp -r config/ "${targetReleasePath}/config/"
    cp -r src/ "${targetReleasePath}/src/"
    cp -r templates/ "${targetReleasePath}/templates/"
    mkdir "${targetReleasePath}/vendor/"
    cp "$targetPath/config.json" "${targetReleasePath}/config.json"
    cp "$targetPath/.env" "${targetReleasePath}/.env"

    # Google analytics script
    if [ $analytics = 0 ]
    then
        rm "${targetReleasePath}/dist/analytics.js"
    fi

    mv "$projectDir/config.sample.json" "$projectDir/config.json"
    mv "$projectDir/app/manifest.sample.json" "$projectDir/app/manifest.json"
    cd --

    # Set correct rights
    chgrp -R www-data "${targetReleasePath}/"
    chmod 640 "${targetReleasePath}/.env"

    # Composer & Symfony stuff
    pushd "$targetPath/versions/$version/"
    /usr/local/bin/composer install --no-dev --optimize-autoloader
    php bin/console cache:clear --env=prod --no-debug
    popd

    # Switch to latest release
    rm -f "$targetPath/current"
    ln -s "${targetReleasePath}/" "$targetPath/current"

    echo "Version $version created"
else
    echo "$target does not exist"
fi
