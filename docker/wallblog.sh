#!/bin/bash

cd /var/www/wallblog
#npm install

pushd /var/www/wallblog/api
#composer install
popd

mv /var/www/pictures/* /var/www/wallblog/build/pictures/

npm start
