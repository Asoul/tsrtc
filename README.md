# Taiwan Stock Real Time Crawler

這是一個會爬 150 隻當沖清單的 crawler。

## 使用方法

## 資料格式

/data/20150224/1101.csv

## 當沖清單

1. 下載 [http://www.twse.com.tw/ch/trading/exchange/TWTB4U/TWTB4U.php](台灣證券交易所－當日沖銷交易標的及統計) 最新清單
2. 可能要更改 `getCurrentList.py` 的檔案名稱
3. `python getCurrentList.py` 得到 `stocknumber.csv`

## TODO

- 每天爬完要整理資料
- proxy
- 分享資源
- update readme
- frame rate 變成 3 秒
- 只爬 0900 ~ 1325
- 測試 0830 ~ 0900 的情況：(有價證券的開盤價格係當市第一筆成交價格，一般自上午 8：30 起證券商輸入委託，至上午 9：00 決定開盤價格時，已累積 30 分鐘買賣委託，故不執行瞬間價格穩定措施，而直接依漲跌幅範圍內，滿足最大成交量的價位成交。)
- 測試 1325 ~ 1330 的情況：(收盤委託時間自下午 1：25 分起至下午 1：30 止，該 5 分鐘內暫停撮合，但電腦持續接受買賣申報輸入、改量及取消作業，直至下午 1：30 停止上述委託作業，再依集合競價決定收盤價格並執行撮合，針對個股收盤 5 分鐘集合競價結果，若無任何買賣申報得以成交時，則以當日最後一次成交價格作為收盤價；若當日均無成交者，則無收盤價。)
- 每天完的整理數據
- 檢查 `13:27:49,74.80,5,1904,75.00_,0_,74.90_,0_ ` 是沒有最佳五檔的意思嗎？

## 證交所 API Document （偽）

經過解析 [http://mis.twse.com.tw/stock/fibest.jsp](基本市況報導網站) 下所執行的 Javascript 檔（可以參考 `/ctrl-reference` ），整理出了 twse 的 API 清單如下：

- getChartOhlcStatis
- getDailyRangeOnlyKD
- getDailyRangeWithMA
- getOhlc
- getShowChart
- getStock
- getStockInfo
- getStockNames
- resetSession

### getStockInfo Usage

其中 `getStockInfo` 可以用來抓取當前的交易資訊，用法如下：

```
http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=STOCK_NUMBER&json=1&delay=0
```

- STOCK_NUMBER 是該隻股票的種類和號碼，ex. `tse_1101.tw`，也可以用 `|` 一次 query 很多筆股票資料。
- json=1 不知為何，但參考的程式碼中是如此設定的
- delay=0 不知為何，但參考的程式碼中是如此設定的

### getStockInfo Response

分析 response 的 JSON 可以得到：

- msgArray
- queryTime
- rtcode
- referer
- rtmessage
- userDelay

其主要資訊都在 `msgArray` 中，分為以下幾類：

#### 股票資訊

- c：股票代號，ex. `1101`
- ch：Channel，ex. `1101.tw`
- ex：上市或上櫃，ex. `tse`
- n：股票名稱，ex. `台泥`
- nf：似乎為全名，ex. `台灣水泥股份有限公司`

#### 即時交易資訊

- z：最近成交價，ex. `42.85`
- tv：Temporal Volume，當盤成交量，ex. `1600`
- v：Volume，當日累計成交量，ex. `11608`
- a：最佳五檔賣出價格，ex. `42.85_42.90_42.95_43.00_43.05_`
- f：最價五檔賣出數量，ex. `83_158_277_571_233_`
- b：最佳五檔買入價格，ex. `42.80_42.75_42.70_42.65_42.60_`
- g：最佳五檔買入數量，ex. `10_28_10_2_184_`
- tlong：資料時間，ex. `1424755800000`
- t：資料時間，ex. `13:30:00`
- ip：好像是一個 flag，3 是暫緩收盤股票, 2 是趨漲, 1 是趨跌， ex. `0`

#### 日資訊

- d：今日日期，ex. `20150224`
- h：今日最高，ex. `42.90`
- l：今日最低，ex. `42.35`
- o：開盤價，ex. `42.40`
- u：漲停點，ex. `45.10`
- w：跌停點，ex. `39.20`
- y：昨收，ex. `42.15`

#### 不明所以
- i： ex. `01`
- it： ex. `12`
- p： ex. `0`
- tk0： ex. `1101.tw_tse_20150224_B_9999310874`
- tk1： ex. `1101.tw_tse_20150224_B_9999293545`

<b>以上資訊由於找不到官方 API，為分析所得，可能有誤。</b>