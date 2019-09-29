from pymongo import MongoClient
from pprint import pprint

# ----------------------- MONGO CONNECTION CODE -------------------------------
client = MongoClient("mongodb+srv://dbUser:RamHacks2019@cluster0-phwms.mongodb.net/test?retryWrites=true&w=majority")

# get 'test' database
db=client.test

# get collection named 'my_collection'
data = db.reddit_data_crypto
# -------------------------------------------------
import re

# get the submissions and put into spacy format
submissions = data.find()
raw_text = ''
for submission in submissions:
	for comment in submission["comments"]:
		raw_text += comment + ' '

processed_submission = raw_text.lower()
processed_submission = re.sub('[^a-zA-Z]', ' ', processed_submission)
processed_submission = re.sub(r'\s+', ' ', processed_submission)

# ---------------------------   NLP code  -------------------------------------
import spacy
nlp = spacy.load('en_core_web_sm')

# import phrase matcher
from spacy.matcher import PhraseMatcher
phrase_matcher = PhraseMatcher(nlp.vocab)

btc_count = 0;
eth_count = 0;
ltc_count = 0;
bch_count = 0;
eos_count = 0;
xrp_count = 0;
etc_count = 0;
trx_count = 0;
bnb_count = 0;
okb_count = 0;


# declare crypto phrases
phrases = ['bitcoin', 'bit coin', 'ethereum', 'eth', 'btc', 'xrp', 'bch',
	'bitcoin cash', 'litecoin', 'ltc', 'eos', 'xlm', 'stellar lumens',
	'dash', 'tezos', 'xtz', 'link', 'chainlink', 'etc', 'ethereum classic',
	'usd coin', 'usdc', 'zcash', 'zec', 'bat', 'basic attention coin', 'zrx',
	'ox', 'augur', 'rep', 'dai', 'dogecoin', 'doge', 'tether', 'binance coin',
	'bnb', 'usdt', 'bitcoin sv', 'bsv', 'unus sed leo', 'leo', 'cardano', 'ada',
	'monero', 'xmr', 'tron', 'trx', 'huobi token', 'ht', 'huobi', 'iota', 'miota',
	'neo', 'maker', 'mkr', 'cosmos', 'atom', 'nem', 'xem', 'crypto.com chain',
	'cro', 'ino coin', 'ino', 'ontology', 'ont', 'paxos standard token',
	'pax', 'hedgetrade', 'hedg', 'trueusd', 'tusd', 'vechain', 'vet', 'okb']

patterns = [nlp(text) for text in phrases]

nlp.max_length = 9999999999999;

phrase_matcher.add('Crypto', None, *patterns)

sentence = nlp(processed_submission)

matched_phrases = phrase_matcher(sentence)


# print results of matching
for match_id, start, end in matched_phrases:
	string_id = nlp.vocab.strings[match_id]
	span = sentence[start:end]
	if (str(span.text) == 'bitcoin' or str(span.text) == 'btc' or str(span.text) == 'bit coin'):
		btc_count += 1
	elif (str(span.text) == 'ethereum' or str(span.text) == 'eth'):
		eth_count += 1
	elif (str(span.text) == 'litecoin' or str(span.text) == 'ltc'):
		ltc_count += 1
	elif (str(span.text) == 'bitcoin cash' or str(span.text) == 'bch'):
		bch_count += 1
	elif (str(span.text) == ('eos')):
		eos_count += 1
	elif (str(span.text) == ('xrp')):
		xrp_count += 1
	elif (str(span.text) == ('ethereum classic')):
		etc_count += 1
	elif (str(span.text) == 'tron' or str(span.text) == 'trx'):
		trx_count += 1
	elif (str(span.text) == 'binance coin' or str(span.text) == 'bnb'):
		bnb_count += 1
	elif (str(span.text) == ('okb')):
		okb_count += 1

	print(match_id, string_id, start, end, span.text)

print('bitcoin mentions: ' + str(btc_count))
print('ethereum mentions: ' + str(eth_count))
print('litecoin mentions: ' + str(ltc_count))
print('bitcoin cash mentions: ' + str(bch_count))
print('eos mentions: ' + str(eos_count))
print('xrp mentions: ' + str(xrp_count))
print('ethereum classic mentions: ' + str(etc_count))
print('tron mentions: ' + str(trx_count))
print('binance coin mentions: ' + str(bnb_count))
print('okb mentions: ' + str(okb_count))
