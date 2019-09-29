#! python3
import praw
import pandas as pd
import datetime as dt
import dateutil
import json
from pymongo import MongoClient
from pprint import pprint
import requests
import collections
import time

#connect to the MongoDb database
client = MongoClient("mongodb+srv://dbUser:RamHacks2019@cluster0-phwms.mongodb.net/test?retryWrites=true&w=majority")
db = client.test
serverStatusResult=db.command("serverStatus")

#set up to get data from reddit
reddit = praw.Reddit(client_id='Xl3GqjiMRY_Zqw', \
                     client_secret='t2901Yo3GLUcsI-4TQIwTM-DQ4A', \
                     user_agent='crypto_scraper', \
                     username='ramhacks2019', \
                     password='ramhacks2019!')

def getStockData():
    count = 0
    collection = db.stock_prices
    key = 'ZY8FJ7CPXFPJSF8J'
    stocks = ['TSLA','GOOGL','FB','EOG','AAPL','AMZN','COF','NVDA','JNJ','MU']
    stocksFull = ['Tesla','Google','Facebook','EOG Resources Inc.','Apple','Amazon','Capital One','NVIDIA','Johnson & Johnson','Micron Technology, Inc']
    for stock in stocks:
        URL = "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=" + stock + "&outputsize=full&apikey=" + key
        r = requests.get(url = URL)
        data = r.json()
        dateAndClose = []
        stockData = {'name':stocks[count],'symbol':stock}
        a = []
        for dates in data['Time Series (Daily)'].items():
            if dates[0] > "2018-09-27":
                a.insert(0,[dates[0],dates[1]['4. close']])
        stockData['priceList'] = a
        collection.insert_one(stockData)
        count+=1
        time.sleep(15)


#function that gets data about the price of different crypto currencies
def getCryptoData():
    #initialize variables
    collection = db.crypto_prices
    currencies = ['BTC','ETH','LTC','BCH','EOS','XRP','ETC','TRX','BNB','OKB']
    count = 1
    #loop for each currency in the list of currencies
    for c in currencies:
        URL = "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=" + c + ",USD"
        r = requests.get(url = URL)
        data = r.json()
        rate = 1 / float(data[c])
        data['coin'] = c
        data[c] = count
        data['USD'] = rate * data['USD']
        now = dt.datetime.now()
        data['time'] = now.strftime('%Y-%m-%d-%H-%M-%S')
        data['priceHistory'] = []
        i = 0;
        while i < 365:
            newArray = []
            now = dt.datetime.now()
            day = int(dt.datetime.timestamp(now + dateutil.relativedelta.relativedelta(days=-i)))
            URL = "https://min-api.cryptocompare.com/data/dayAvg?fsym=" + c + "&tsym=USD&toTs=" + str(day)
            req = requests.get(url = URL)
            histData = req.json()
            newArray.insert(1,histData['USD'])
            newArray.insert(0,day)
            #pprint(newArray)
            i += 1
            data['priceHistory'].append(newArray)

        #data['priceHistory'].append(newArray)
        collection.insert_one(data)
        pprint(data)

        count += 1

#function to retrieve data from a given subreddit and place into
#given collection in database
def getRedditData(subreddit,collection):
    for submission in subreddit.top(limit=7300,time_filter='year'):
        allComm = []
        submission.comments.replace_more(limit=0)
        for comment in submission.comments:
            allComm.append(comment.body)
        #json format
        jsonDict = {
            "type": "reddit",
            "id": submission.id,
            "title": submission.title,
            "body": submission.selftext,
            "comments": allComm,
            "date": dt.datetime.utcfromtimestamp(submission.created).strftime('%Y-%m-%d')
        }
        jsonObj = json.dumps(jsonDict)
        collection.replace_one({"id":submission.id},jsonDict,True)

#subreddit = reddit.subreddit('CryptoCurrency')
#collection = db.reddit_data_crypto
#getRedditData(subreddit,collection)
#subreddit = reddit.subreddit('Stocks')
#collection = db.reddit_data_stocks
#getRedditData(subreddit,collection)
getCryptoData()
#getStockData()
