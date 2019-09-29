require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const moment = require('moment');
const fs = require('fs');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:RamHacks2019@cluster0-phwms.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const createCsvWriter = require('csv-writer').createObjectCsvWriter;


	// build according to results from reddit data
	const crypto = [
		{
			name: 'Ethereum',
			votes: 100,
		},
		{
			name: 'Bitcoin',
			votes: 150,
		},
		{
			name: 'Litecoin',
			votes: 10,
		},
		{
			name: 'XRP',
			votes: 20,
		},
		{
			name: 'Bitcoin Cash',
			votes: 50,
		},
	];

	// build according to results from stock data
	const stocks = [
		{
			name: 'Tesla (TSLA)',
			votes: 777,
		},
		{
			name: 'Netflix (NFLX)',
			votes: 300,
		},
		{
			name: 'Chipotle (CMG)',
			votes: 550,
		},
		{
			name: 'Capital One (COF)',
			votes: 900,
		},
		{
			name: 'Dominion Energy (D)',
			votes: 1000,
		},
	];


	const app = express();
	app.use(cors());
	// app.use(moment());

	// get crypto prices
	client.connect(err => {
		const cryptoCollection = client.db("test").collection("crypto_prices");

		cryptoCollection.find({}).toArray(function(err, result) {
			if (err) throw err;
			console.log(result);
			app.get('/crypto', (req, res) => {
				res.json(result);
			});
		});

		client.close();
	});


	let rawdata = fs.readFileSync('sample-data.json');
	let chart = JSON.parse(rawdata);


	app.get('/chart', (req, res) => {
		res.json(chart);
	});


	app.set('port', process.env.PORT || 4000);
	const server = app.listen(app.get('port'), () => {
		console.log(`Express running → PORT ${server.address().port}`);
	});
