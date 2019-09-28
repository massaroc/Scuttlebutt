import praw
from praw.models import MoreComments
import csv

from pymongo import MongoClient
from pprint import pprint

# ----------------------- MONGO CONNECTION CODE -------------------------------
client = MongoClient("mongodb+srv://dbUser:RamHacks2019@cluster0-phwms.mongodb.net/test?retryWrites=true&w=majority")
db=client.admin
# Issue the serverStatus command and print the results
serverStatusResult=db.command("serverStatus")
pprint(serverStatusResult)
# -----------------------------------------------------------------------------

# ------------------------ Getting reddit comments ----------------------------
submission_list = [] # for grabbing top 10 submissions in a subreddit sorted by hot
comment_list = []

reddit = praw.Reddit(user_agent='Comment Extraction (by /u/whiirl)',
					client_id='CEV5kSF2yrPMiw', client_secret="i9ccu9gkn5v4u17dKhLru7cLf50",
					username='whiirl', password='ramhacks2019')

# open "stocks" subreddit
subreddit = reddit.subreddit('stocks')

with open('output/reddit_comments.csv', mode='w') as file:
	writer = csv.writer(file, delimiter=',', quotechar='"', quoting=csv.QUOTE_MINIMAL)

	# get top 10 hot posts, store in submission_list
	for submission in subreddit.hot(limit=10):
		submission_list.append(submission)
		submission.comments.replace_more(limit=None)
		for comment in submission.comments.list():
			comment_list.append(comment.body)
			writer.writerow([comment])


	for comment in comment_list:
		print(comment)



# -----------------------------------------------------------------------------
