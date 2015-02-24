#!/usr/bin/python
# -*- coding: utf-8 -*-

import requests
import json
import csv
from os import mkdir
from os.path import isdir, isfile, join
from datetime import date, timedelta
import sys
import math

# 從 stocknumber.csv 中讀出要爬的股票清單
stock_id_list = []
f = open('stocknumber.csv', 'rb')
for row in csv.reader(f, delimiter=','):
    stock_id_list.append(row[0])


# 拆成小的 subtasks 的號碼
if len(sys.argv) == 3:
    task_id = int(sys.argv[1])
    task_base = int(math.ceil(len(stock_id_list)/int(sys.argv[2])))

else:
    task_id = 0
    task_base = len(stock_id_list)

# 錯誤輸出檔案
error_log = open('error.log', 'a')

# 今天年月日
today = str(date.today().year).zfill(4)+str(date.today().month).zfill(2)+str(date.today().day).zfill(2)

# 如果資料夾不存在，就開新的一天的資料夾
if not isdir(join('data',today)):
    mkdir(join('data',today))

# 把每一隻都爬一遍
for stock_id in stock_id_list[task_id*task_base:(task_id+1)*task_base]:
    try:
        page = requests.get('http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_'+stock_id+'.tw&json=1&delay=0')
        if page.status_code != 200:
            raise Exception("HTTP Request Failed")

        content = json.loads(page.content)
    
        # 檢查資料是否錯誤
        if 'msgArray' not in content:
            raise Exception("Can not find msgArray")
        if len(content['msgArray']) != 1:
            raise Exception("msgArray error")

        vals = content['msgArray'][0]

        # 如果是在超過凌晨 12 點到隔日開市前抓，要算昨天的
        if vals['d'] != today:
            yesterday = date.today() - timedelta(1)
            today = str(yesterday.year).zfill(4)+str(yesterday.month).zfill(2)+str(yesterday.day).zfill(2)
            if vals['d'] != today:
                raise Exception("Date Error")
            # 昨天沒有資料夾的話幫忙補上
            if not isdir(join('data',today)):
                mkdir(join('data',today))

        # 讀取上一筆資料
        count = 0

        if isfile(join('data', today, stock_id+'.csv')):
            with open(join('data', today, stock_id+'.csv'), 'rb') as ftmp:
                for last_data in csv.reader(ftmp, delimiter=','):
                    count += 1

        # 資料格式
        # - t：資料時間，ex. `13:30:00`
        # - z：最近成交價，ex. `42.85`
        # - tv：Temporal Volume，當盤成交量，ex. `1600`
        # - v：Volume，當日累計成交量，ex. `11608`
        # - a：最佳五檔賣出價格，ex. `42.85_42.90_42.95_43.00_43.05_`
        # - f：最價五檔賣出數量，ex. `83_158_277_571_233_`
        # - b：最佳五檔買入價格，ex. `42.80_42.75_42.70_42.65_42.60_`
        # - g：最佳五檔買入數量，ex. `10_28_10_2_184_`

        # 如果有歷史資料，而且資料和上一筆一模一樣，就不要紀錄
        if (count > 0 and vals['t'] == last_data[0] and vals['z'] == last_data[1] and 
            vals['tv'] == last_data[2] and vals['v'] == last_data[3] and vals['a'] == last_data[4] and 
            vals['f'] == last_data[5] and vals['b'] == last_data[6] and vals['g'] == last_data[7]):
            
            print stock_id, "no update"
            continue
        else:
            fo = open(join('data', today, stock_id+'.csv'), 'ab')
            cw = csv.writer(fo, delimiter=',')
            cw.writerow([vals['t'], vals['z'], vals['tv'], vals['v'],
                         vals['a'], vals['f'], vals['b'], vals['g']])
            
            print stock_id, "update"
        
    except Exception as e:
        err_str = '[ERROR] ' + str(stock_id) + e.message
        print err_str
        error_log.write(err_str+'\n')
