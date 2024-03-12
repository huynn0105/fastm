#!/bin/sh
date=$(date +%s)
git tag build_rc_$date
git push origin build_rc_$date