#!/usr/bin/python
# -*- coding: utf-8 -*-

for j in range(20):
    print '* 08-12 * * * ( sleep '+str(j*3%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py )'

for j in range(20):
    print '0-30 13 * * * ( sleep '+str(j*3%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py )'

# 如果要產生 subtask 的 crontab 要用下面的 generator
# num = 3
# for i in range(num):
#     for j in range(20):
#         print '* 08-13 * * * ( sleep '+str((j*3+i)%60)+' ; cd /root/tsrtc && /usr/bin/python crawl.py '+str(i)+' '+str(num)+' )'
