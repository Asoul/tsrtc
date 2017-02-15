# Taiwan Stock Real Time Crawler

這是一個會爬台股即時資訊的爬蟲，此外也分析了台灣證券交易所的 API。

## 討論室

有問題的話可以到 [Gitter.im](https://gitter.im/taiwan-stock/Lobby) 發問，會盡快回答

## 環境需求

- Python2 or Python3

## 安裝相關套件

```
pip install requests
```

## 使用方法

`python crawl.py`

可以爬當下 50 隻當沖股票的即刻資訊。

## 注意事項

### 更改清單

若要改抓取的清單，可以把 `stocknumber.csv` 中的股票編號換掉就好了。

### 資料完整性

雖然說官方文件說 5 秒會更新一次，但是爬蟲實際上戳，即便已經改成 3 秒戳一次了，每天總會漏掉一些交易，所以價量圖並不完善，約只能涵蓋 `99%` 的資料。

`python genTodayVolumeFigure.py` 可以產生今天的價量圖，ex：

```
9914
250.00:      39
250.50:     123
251.00:       8
251.50:      58
252.00:     122
252.50:      87
253.00:     198
253.50:      91
254.00:      38
254.50:     103
255.00:      29
255.50:       9
256.00:       1
(99.77974%)
```

### 資料整理

每天跑完後，可以執行 `python cleanTodayDuplicateData.py` 刪除重複抓到的資料和依照時間排序。

### 資料更新

每天收盤後我抓完會 push 到 github 上，如果需要的話可以 `git pull` 我，當然如果你也有自己抓的話，每天也可以自己更新囉。

因為機器空間不足，所以過去的資料放到 Mega 上：

- [2015/08/13 ~ 2016/10/13](https://mega.nz/#!rc9m3CjR!echcpcdjV4Ayq5QZIvcFRJzt46CH-IXDGc2bl3tgX50)
- [2015/02/26 ~ 2015/08/12](https://mega.nz/#!HZs2HQhS!rbHJDdhr87911DnwIjvUIEZu1W2MOqOm4ihiUnmEM4o)

### Crontab 產生

`python genCrontabScript.py` 可以產生每五秒戳一次的 crontab。

## 資料格式

每天的資料會存在 `data` 中，當天的日期資料夾內（ex. `20150303`），裡面把所有抓的資料按股票編號放 `XXXX.csv` 中，`XXXX` 就是股票編號。

檔案內每一行為一個抓取一次下即刻的資訊，分別是：

時間, 最近成交價, 當盤成交量, 累積成交量, 最佳五檔（賣價）, 最佳五檔（賣量）, 最佳五檔（買價）, 最佳五檔（買量）

ex. `13:30:00,43.25,616,6690,43.25_43.30_43.35_43.40_43.45_,216_285_90_274_201_,43.20_43.15_43.10_43.05_43.00_,3_1_23_91_424_`

## 更新當沖清單

1. 下載 [台灣證券交易所－當日沖銷交易標的及統計](http://www.twse.com.tw/ch/trading/exchange/TWTB4U/TWTB4U.php) 最新清單
2. 可能要更改 `getCurrentList.py` 的檔案名稱
3. `python getCurrentList.py` 得到 `stocknumber.csv`

## 資料來源

[台灣證券交易所 - 基本市況報導網站](http://mis.twse.com.tw/stock/fibest.jsp)

## 證交所 API Document （偽）

經過解析 [基本市況報導網站](http://mis.twse.com.tw/stock/fibest.jsp) 下所執行的 Javascript 檔（可以參考 `/ctrl-reference` ），整理出了 twse 的 API 清單如下：

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
http://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=STOCK_NUMBER&_=CURRENT_TIME
```

參數設置：

- STOCK_NUMBER 是該隻股票的種類和號碼，ex. `tse_1101.tw_20150624`，也可以用 `|` 一次 query 很多筆股票資料。ex. `tse_1101.tw_20150624|tse_1102.tw_20150624|tse_1103.tw_20150624`
- CURRENT_TIME 是當下的 epoch time，單位是毫秒

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

## 附上免責聲明

本人旨在為廣大投資人提供正確可靠之資訊及最好之服務，作為投資研究的參考依據，若因任何資料之不正確或疏漏所衍生之損害或損失，本人將不負法律責任。是否經由本網站使用下載或取得任何資料，應由您自行考量且自負風險，因任何資料之下載而導致您電腦系統之任何損壞或資料流失，您應負完全責任。

## 聯絡我

有 Bug 麻煩跟我說：

- [Gitter.im](https://gitter.im/taiwan-stock/Lobby)
- `azx754@gmail.com`

最後更新時間：`2017/02/15`

## 我的其他專案

[台灣上市上櫃股票爬蟲，含歷史資料](https://github.com/Asoul/tsec)
