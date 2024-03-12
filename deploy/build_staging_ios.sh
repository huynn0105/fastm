#!/bin/sh
date=$(date +%s)
git tag ios_build_staging_$date
git push origin ios_build_staging_$date