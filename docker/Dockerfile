FROM php:5.6-fpm

MAINTAINER Johan Poirier, johan.poirier@gmail.com

# PHP modules
RUN apt-get update && apt-get install -y libjpeg-dev libpng-dev
RUN docker-php-ext-configure gd --enable-gd-native-ttf --with-jpeg-dir=/usr/lib/x86_64-linux-gnu --with-png-dir=/usr/lib/x86_64-linux-gnu
RUN docker-php-ext-install pdo pdo_mysql gd exif

# Supervisor
RUN apt-get update && apt-get install -y supervisor && mkdir -p /var/log/supervisor
COPY ./config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Nginx
RUN apt-get update && apt-get install -y nginx
RUN rm /etc/nginx/sites-enabled/default
COPY ./config/nginx.conf /etc/nginx/sites-enabled/wallblog

# MySQL
RUN apt-get update \
&& apt-get install -y debconf-utils \
&& echo mysql-server-5.5 mysql-server/root_password password root | debconf-set-selections \
&& echo mysql-server-5.5 mysql-server/root_password_again password root | debconf-set-selections \
&& apt-get install -y mysql-server-5.5 -o pkg::Options::="--force-confdef" -o pkg::Options::="--force-confold" --fix-missing
COPY ./mysql /tmp/mysql
RUN /tmp/mysql/init.sh

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash - && apt-get install -y nodejs

# Bower & Gulp
RUN npm install -g bower && npm install -g gulp

# Git
RUN apt-get update && apt-get install -y git

# Run
CMD ["/usr/bin/supervisord", "-n"]
