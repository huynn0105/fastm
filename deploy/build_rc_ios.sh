#!/bin/sh
date=$(date +%s)
git tag ios_build_rc_$date
git push origin ios_build_rc_$date