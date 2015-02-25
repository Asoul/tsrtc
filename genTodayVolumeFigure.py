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

# 刪除重複的資料
for stock_id in index_list:
    dist = dict()
    f = open(join('data', today, stock_id+'.csv'), 'rb')
    for row in csv.reader(f, delimiter =','):
        # t, z, tv, v,
        
        # 如果沒有交易成功，就跳過
        try:
            float(row[1])
        except:
            print 'Q_Q'
            continue

        # 開盤第一筆    
        if len(dist) == 0:
            dist[float(row[1])] = int(row[3])

        # 沒有新的買賣就不要紀錄
        elif int(row[3]) == last_v: continue

        # 同樣的價位有多的單
        elif float(row[1]) == last_z and int(row[2]) - last_tv == int(row[3]) - last_v:
            dist[last_z] += int(row[2]) - last_tv

        # 假設價位相同但是 tv 重新採計
        elif float(row[1]) == last_z and int(row[2]) == int(row[3]) - last_v:
            dist[last_z] += int(row[2])

        # 價變了
        elif float(row[1]) != last_z:
            if float(row[1]) in dist:
                dist[float(row[1])] += int(row[2])
            else:
                dist[float(row[1])] = int(row[2])
        # 錯誤情況處理
        else:
            print row

        last_z = float(row[1])
        last_tv = int(row[2])
        last_v = int(row[3])

    print dist
    break