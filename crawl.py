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

from timedelta import total_seconds
page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw_20150212&_=1423722600000')
page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw_20150224')
page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw_20150224&json=1&delay=0&_=1424753643229')
page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_1101.tw_20150224')
content = json.loads(page.content)
print content['msgArray'][0]['d'], content['msgArray'][0]['z']

# JSON 格式
# msgArray
Channel
#     ch 1101.tw
3 是暫緩收盤股票, 2 是趨漲, 1 是趨跌
#     ip 0
上市或上櫃 (tse = 上市)
#     ex tse
累計總量
#     tv 1600

資料時間
#     tlong 1424755800000

股票代號
#     c 1101
今日日期
#     d 20150224
最佳五檔賣出價格
#     a 42.85_42.90_42.95_43.00_43.05_
最價五檔賣出數量
#     f 83_158_277_571_233_
最佳五檔買入價格
#     b 42.80_42.75_42.70_42.65_42.60_
最佳五檔買入數量
#     g 10_28_10_2_184_
今日最高
#     h 42.90
今日最低
#     l 42.35
開盤價
#     o 42.40
股票名稱
#     n 台泥
漲停點
#     u 45.10
跌停點
#     w 39.20
揭示時間
#     t 13:30:00
累計成交量
#     v 11608
昨收
#     y 42.15
最近成交價
#     z 42.85
code 裡面沒有出現
#     i 01
#     it 12
#     p 0
#     nf 台灣水泥股份有限公司
#     tk0 1101.tw_tse_20150224_B_9999310874
#     tk1 1101.tw_tse_20150224_B_9999293545

# queryTime
#     sysDate 20150224
#     stockInfoItem 7225
#     stockInfo 702896
#     sessionKey tse_1101.tw_20150224|
#     sessionFromTime -1
#     showChart False
#     sessionLatestTime -1
#     sysTime 13:53:45
#     sessionStr UserSession
# rtcode "0000"
# referer ""
# rtmessage "OK"
# userDelay 5000

for i in content:
    print i
    if type(content[i]) == dict:
        for j in i:
            print j
            if type(i[j]) == dict:
                for k in j:
                    print i, j, k, j[k]
