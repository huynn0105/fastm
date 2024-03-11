#!/bin/sh
date=$(date +%s)
git tag build_staging_$date
git push origin build_staging_$date