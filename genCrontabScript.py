#!/usr/bin/python
# -*- coding: utf-8 -*-

for j in range(12):
    print '* 08-13 * * * ( sleep '+str(j*5%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py )'

# 如果要產生 subtask 的 crontab 要用下面的 generator
# num = 3
# for i in range(num):
#     for j in range(12):
#         print '* 08-13 * * * ( sleep '+str((j*5+i)%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py '+str(i)+' '+str(num)+' )'
