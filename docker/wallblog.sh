#!/bin/bash

cd /var/www/wallblog
npm install
echo " - npm OK"
bower --allow-root install
echo " - bower OK"
rm -f ./logs/gulp.log
touch ./logs/gulp.log
#gulp > ./logs/gulp.log 2>&1 &
#echo " - gulp OK"
