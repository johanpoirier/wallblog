FROM php:5.6-fpm

MAINTAINER Johan Poirier, johan.poirier@gmail.com

RUN apt-get update && apt-get install -y supervisor && mkdir -p /var/log/supervisor
ADD ./config/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

RUN apt-get update && apt-get install -y nginx

RUN apt-get update \
&& apt-get install -y debconf-utils \
&& echo mysql-server-5.5 mysql-server/root_password password root | debconf-set-selections \
&& echo mysql-server-5.5 mysql-server/root_password_again password root | debconf-set-selections \
&& apt-get install -y mysql-server-5.5 -o pkg::Options::="--force-confdef" -o pkg::Options::="--force-confold" --fix-missing

RUN curl -sL https://deb.nodesource.com/setup_0.12 | bash - && apt-get install -y nodejs

RUN npm install -g bower && npm install -g gulp

CMD ["/usr/bin/supervisord", "-n"]
