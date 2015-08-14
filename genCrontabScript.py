#!/usr/bin/python
# -*- coding: utf-8 -*-

for j in range(12):
    print '* 09-12 * * 1-5 ( sleep '+str(j*5%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py )'

for j in range(12):
    print '0-33 13 * * 1-5 ( sleep '+str(j*5%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py )'
