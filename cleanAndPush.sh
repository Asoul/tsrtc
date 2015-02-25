#!/bin/bash
cd /root/tsrtc/
/usr/bin/python cleanTodayDuplicateData.py
/usr/bin/git add .
/usr/bin/git commit -m "daily update"
/usr/bin/git push
