# Taiwan Stock Real Time Crawler

這是一個會爬 150 隻當沖清單的 crawler，可以拿來做當沖的參考依據。

## 使用方法

## 資料格式

/data/20150224/1101.csv

## 當沖清單

1. 下載 [http://www.twse.com.tw/ch/trading/exchange/TWTB4U/TWTB4U.php](台灣證券交易所－當日沖銷交易標的及統計) 最新清單
2. 可能要更改 `getCurrentList.py` 的檔案名稱
3. `python getCurrentList.py` 得到 `stocknumber.csv`

## TODO

- 寫好爬蟲
- 分散爬蟲
- 分享資源
- 盤前 30 分鐘資訊
- 延後交易資訊

## API Document

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

```http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=STOCK_NUMBER&json=1&delay=0```

- STOCK_NUMBER 是該隻股票的代號
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

#### 日資訊

- d：今日日期，ex. `20150224`
- h：今日最高，ex. `42.90`
- l：今日最低，ex. `42.35`
- o：開盤價，ex. `42.40`
- u：漲停點，ex. `45.10`
- w：跌停點，ex. `39.20`
- y：昨收，ex. `42.15`
- ip：好像是一個 flag，3 是暫緩收盤股票, 2 是趨漲, 1 是趨跌， ex. `0`

#### 不明所以
- i：ex. `01`
- it： ex. `12`
- p： `0`
- tk0： `1101.tw_tse_20150224_B_9999310874`
- tk1： `1101.tw_tse_20150224_B_9999293545`

<b>以上資訊由於找不到官方 API，以下資訊為分析所得，可能有誤。</b>