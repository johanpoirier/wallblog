#!/bin/bash

/etc/init.d/mysql start
mysql -uroot -proot -e "CREATE DATABASE wallblog;"
mysql -uroot -proot -e "CREATE USER 'wallblog'@'localhost' IDENTIFIED BY 'password'";
mysql -uroot -proot -e "GRANT ALL PRIVILEGES ON *.* TO 'wallblog'@'localhost'";
mysql -uroot -proot -e "FLUSH PRIVILEGES";
mysql -uwallblog -ppassword wallblog < /tmp/mysql/schema.sql
