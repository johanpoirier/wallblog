#!/usr/bin/env bash

version=`npm run version:minor`
gulp package --buildVersion=$version
webpack -p --buildVersion=$version
rm *.css
