#!/usr/bin/python
# -*- coding: utf-8 -*-
num = 15
for i in range(num):
    for j in range(12):
        print '* 08-13 * * * ( sleep '+str((i+5*j)%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py '+str(i)+' '+str(num)+' )'