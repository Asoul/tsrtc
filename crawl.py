#!/usr/bin/python
# -*- coding: utf-8 -*-

import requests
import json
import csv
from os.path import isfile, join, getsize
from datetime import date, datetime
import time
current_milli_time = lambda: int(round(time.time() * 1000))
time.mktime(datetime(2015,2,12,10,0,0).timetuple())

apiBaseUrl+"getStockInfo.jsp?ex_ch="+stock+"&json=1&delay=0"
page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw_20150212&_=1423722600000')
page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw_20150224')
page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw_20150224&json=1&delay=0&_=1424753643229')
page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw_20150224')
content = json.loads(page.content)
print content['msgArray'][0]['d'], content['msgArray'][0]['z']
for i in content:
    print i
    if type(content[i]) == dict:
        for j in i:
            print j
            if type(i[j]) == dict:
                for k in j:
                    print i, j, k, j[k]
