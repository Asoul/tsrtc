#!/bin/python
# -*- coding: utf-8 -*-

import csv
import os
from os import listdir
from os.path import isfile, join
from datetime import date

today = str(date.today().year).zfill(4)+str(date.today().month).zfill(2)+str(date.today().day).zfill(2)

# 今天抓到的清單
index_list = [ f[:-4] for f in listdir(join('data', today)) if f[-4:] == '.csv' ]

# 刪除重複的資料並重新排序
for stock_id in index_list:
    rows = []
    f = open(join('data', today, stock_id+'.csv'), 'rb')
    for row in csv.reader(f, delimiter =','):
        if len(rows) > 0 and row in rows:
            continue
        else:
            rows.append(row)
    f.close()
    rows.sort(key = lambda a: a[0])
    f = open(join('data', today, stock_id+'.csv'), 'wb')
    cw = csv.writer(f, delimiter=',')
    for row in rows:
        cw.writerow(row)
    