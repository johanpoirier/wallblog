#!/usr/bin/env bash

version=`npm run version:patch`
gulp package --buildVersion=$version
webpack -p --buildVersion=$version
rm *.css
