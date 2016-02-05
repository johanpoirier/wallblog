#!/usr/bin/env bash

gulp build
gulp watch-codebase &
webpack -d --watch
