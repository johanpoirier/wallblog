#!/bin/sh

HOST='ftp.60gp.ovh.net'
USER='nirgal'
PASSWD='9d9byeld'
FILES='file.txt'
DIR='wallblog'


ftp -n $HOST <<END_SCRIPT
quote USER $USER
quote PASS $PASSWD
cd $DIR
put dist/index.html /wallblog/dist/index.html
quit
END_SCRIPT
exit 0