#!/usr/bin/python
# -*- coding: utf-8 -*-

import requests
import json
import csv
from os import mkdir
from os.path import isdir
from datetime import date

class CrawlerController():
    '''Split targetList into several Crawler'''

    def __init__(self, targetList, maxN = 50):
        self.crawlerList = []

        for i in range(len(targetList) / maxN + 1):
            crawler = Crawler(targetList[maxN * i: maxN * (i+1)])
            self.crawlerList.append(crawler)

    def getStockData(self):
        dataList = []

        for crawler in self.crawlerList:
            dataList.extend(crawler.getStockData())

        return dataList

class Crawler():
    '''request to Market Information System'''

    def __init__(self, targetList):
        self.queryURL = self._getQueryURL(targetList)

    def _getQueryURL(self, targetList):

        query = 'http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch='
        for target in targetList:
            query += ('tse_{}.tw|'.format(target))

        return query[:-1]

    def _handleResponse(self, response):
        try:
            content = json.loads(response.content)
        except Exception, e:
            print e
            data = {}
        else:
            data = content['msgArray']
        finally:
            return data

    def getStockData(self):    
        # 先戳原頁面，再拿資料
        req = requests.session()
        req.get('http://mis.twse.com.tw/stock/index.jsp',
            headers = {'Accept-Language':'zh-TW'}
        )

        response = req.get(self.queryURL)
        dataList = self._handleResponse(response)

        return dataList
        
class Recorder():
    '''record data to csv'''
    def __init__(self, path='data'):
        self.folderPath = '{}/{}'.format(path, date.today().strftime('%Y%m%d'))
        self._checkTodayFolder()

    def _checkTodayFolder(self):
        if not isdir(self.folderPath):
            mkdir(self.folderPath)

    def recordCSV(self, dataList):

        for data in dataList:
            try:
                fo = open('{}/{}.csv'.format(self.folderPath, data['c']), 'ab')
                cw = csv.writer(fo, delimiter=',')
                cw.writerow([data['t'], data['z'], data['tv'], data['v'],
                    data['a'], data['f'], data['b'], data['g']]
                )
        
            except Exception as e:
                print e
                continue

def main():
    
    targetList = [_.strip() for _ in open('stocknumber.csv', 'rb')]

    controller = CrawlerController(targetList)
    recorder = Recorder()

    dataList = controller.getStockData()
    recorder.recordCSV(dataList)
    
if __name__ == '__main__':
    main()
