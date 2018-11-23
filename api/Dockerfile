FROM php:7.2.11-fpm

# Tools
RUN apt-get update \
    && apt-get install -y libjpeg-dev libpng-dev libgmp-dev git gnupg gnupg1 zip

# PHP modules
RUN docker-php-ext-configure gd --enable-gd-native-ttf --with-jpeg-dir=/usr/lib/x86_64-linux-gnu --with-png-dir=/usr/lib/x86_64-linux-gnu --with-gmp=/usr/include/x86_64-linux-gnu
RUN ln -s /usr/include/x86_64-linux-gnu/gmp.h /usr/include/gmp.h && docker-php-ext-install pdo pdo_mysql gd exif gmp
