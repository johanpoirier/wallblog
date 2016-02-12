#!/bin/bash

/etc/init.d/mysql start
mysql -uroot -proot -e "CREATE DATABASE wallblog;"
mysql -uroot -proot wallblog < /tmp/mysql/schema.sql
