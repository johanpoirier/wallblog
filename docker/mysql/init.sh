#!/bin/bash

/etc/init.d/mysql start
mysql -uroot -proot -e "CREATE DATABASE nirgal;"
mysql -uroot -proot nirgal < /tmp/mysql/schema.sql
