#!/usr/bin/python
# -*- coding: utf-8 -*-
num = 2
for i in range(num):
    for j in range(12):
        print '* 08-13 * * * ( sleep '+str((int(5.0/num)*i+5*j)%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py '+str(i)+' '+str(num)+' )'
