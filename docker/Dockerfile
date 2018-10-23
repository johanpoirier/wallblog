FROM php:7.2.11-fpm

MAINTAINER Johan Poirier, johan.poirier@gmail.com

# Tools
RUN apt-get update \
&& apt-get install -y libjpeg-dev libpng-dev libgmp-dev git gnupg gnupg1 wget zip

# PHP modules
RUN docker-php-ext-configure gd --enable-gd-native-ttf --with-jpeg-dir=/usr/lib/x86_64-linux-gnu --with-png-dir=/usr/lib/x86_64-linux-gnu --with-gmp=/usr/include/x86_64-linux-gnu
RUN ln -s /usr/include/x86_64-linux-gnu/gmp.h /usr/include/gmp.h && docker-php-ext-install pdo pdo_mysql gd exif gmp
COPY ./config/php.ini /usr/local/etc/php/php.ini

# Composer
RUN curl -sS https://getcomposer.org/installer -o composer-setup.php
RUN php composer-setup.php --install-dir=/usr/local/bin --filename=composer && rm composer-setup.php

# Supervisor
RUN apt-get update && apt-get install -y supervisor && mkdir -p /var/log/supervisor
COPY ./config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash - && apt-get install -y nodejs

# Nginx
RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
	&& echo "deb http://nginx.org/packages/mainline/debian/ stretch nginx" >> /etc/apt/sources.list \
	&& apt-get update \
	&& apt-get install --no-install-recommends --no-install-suggests -y  apt-transport-https ca-certificates nginx gettext-base \
	&& rm -rf /var/lib/apt/lists/*
RUN rm /etc/nginx/conf.d/default.conf
RUN echo "daemon off;" >> /etc/nginx/nginx.conf
COPY ./config/nginx.conf /etc/nginx/conf.d/wallblog.conf
COPY ./config/openssl.cnf /etc/nginx/ssl/openssl.cnf
RUN openssl req -config /etc/nginx/ssl/openssl.cnf -new -x509 -sha256 -newkey rsa:2048 -nodes -days 3650 -keyout /etc/nginx/ssl/wallblog.local.key -out /etc/nginx/ssl/wallblog.local.crt

# MySQL
RUN apt-get update && apt-get install -y wget gnupg
RUN wget http://repo.mysql.com/mysql-apt-config_0.8.9-1_all.deb \
&& dpkg -i mysql-apt-config_0.8.9-1_all.deb
RUN apt-get update \
&& apt-get install -y debconf-utils\
&& echo mysql-server-5.7 mysql-server/root_password password root | debconf-set-selections \
&& echo mysql-server-5.7 mysql-server/root_password_again password root | debconf-set-selections \
&& apt-get install -y mysql-server -o pkg::Options::="--force-confdef" -o pkg::Options::="--force-confold" --fix-missing
COPY ./mysql /tmp/mysql
RUN /tmp/mysql/init.sh

# Sample pictures
RUN mkdir /var/www/pictures
COPY ./pictures/* /var/www/pictures/


# Run
CMD ["/usr/bin/supervisord", "-n"]
