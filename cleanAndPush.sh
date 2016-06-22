#!/bin/bash
cd /home/asoul/tsrtc/
/usr/bin/python cleanTodayDuplicateData.py
/usr/bin/git add .
/usr/bin/git commit -m "daily update"
/usr/bin/git push
/usr/bin/git fetch --depth=1
/usr/bin/git reflog expire --expire-unreachable=now --all
/usr/bin/git gc --aggressive --prune=all
