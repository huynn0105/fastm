#!/bin/sh
date=$(date +%s)
git tag android_build_staging_$date
git push origin android_build_staging_$date