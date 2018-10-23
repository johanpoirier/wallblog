#!/bin/bash

cd /var/www/wallblog
npm install
composer install

mv /var/www/pictures/* /var/www/wallblog/dist/pictures/
