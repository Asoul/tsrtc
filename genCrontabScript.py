#!/usr/bin/python
# -*- coding: utf-8 -*-
num = 3
for i in range(num):
    for j in range(12):
        print '* 08-13 * * * ( sleep '+str((j*5+i)%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py '+str(i)+' '+str(num)+' )'
