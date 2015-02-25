#!/usr/bin/python
# -*- coding: utf-8 -*-
for i in range(12):
    print '* 08-13 * * * ( sleep '+str(i*5%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py )'
