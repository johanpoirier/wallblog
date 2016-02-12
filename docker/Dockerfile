FROM php:7.0.3-fpm

MAINTAINER Johan Poirier, johan.poirier@gmail.com

# PHP modules
RUN apt-get update && apt-get install -y libjpeg-dev libpng-dev
RUN docker-php-ext-configure gd --enable-gd-native-ttf --with-jpeg-dir=/usr/lib/x86_64-linux-gnu --with-png-dir=/usr/lib/x86_64-linux-gnu
RUN docker-php-ext-install pdo pdo_mysql gd exif

# Supervisor
RUN apt-get update && apt-get install -y supervisor && mkdir -p /var/log/supervisor
COPY ./config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# MySQL
RUN apt-get update \
&& apt-get install -y debconf-utils \
&& echo mysql-server-5.5 mysql-server/root_password password root | debconf-set-selections \
&& echo mysql-server-5.5 mysql-server/root_password_again password root | debconf-set-selections \
&& apt-get install -y mysql-server-5.5 -o pkg::Options::="--force-confdef" -o pkg::Options::="--force-confold" --fix-missing
COPY ./mysql /tmp/mysql
RUN /tmp/mysql/init.sh

# Nginx
RUN apt-key adv --keyserver hkp://pgp.mit.edu:80 --recv-keys 573BFD6B3D8FBC641079A6ABABF5BD827BD9BF62 \
	&& echo "deb http://nginx.org/packages/mainline/debian/ jessie nginx" >> /etc/apt/sources.list \
	&& apt-get update \
	&& apt-get install -y ca-certificates nginx gettext-base \
	&& rm -rf /var/lib/apt/lists/*
RUN rm /etc/nginx/conf.d/default.conf
COPY ./config/wallblog.conf /etc/nginx/conf.d/wallblog.conf

# Node.js
RUN curl -sL https://deb.nodesource.com/setup_5.x | bash - && apt-get install -y nodejs

# Git
RUN apt-get update && apt-get install -y git

# Run
CMD ["/usr/bin/supervisord", "-n"]
