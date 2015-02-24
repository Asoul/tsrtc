#!/bin/python
# -*- coding: utf-8 -*-

import csv

FILE_NAME = 'TWTB4U.csv' 

f = open(FILE_NAME, 'rb')

stock_list = []
count = 0
for row in csv.reader(f, delimiter=','):
    count += 1
    if len(row) == 6 and count > 8:
        stock_list.append(row[0].strip())

fo = open('stocknumber.csv', 'wb')
cw = csv.writer(fo, delimiter=',')
for stock_index in stock_list:
    cw.writerow([stock_index])