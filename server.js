require('dotenv').config({ path: 'variables.env' });
const express = require('express');
const moment = require('moment');
const fs = require('fs');
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://dbUser:RamHacks2019@cluster0-phwms.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

	const app = express();
	app.use(cors());

	// // get crypto prices
	// client.connect(err => {
	// 	const cryptoCollection = client.db("test").collection("crypto_prices");
	//
	// 	cryptoCollection.find({}).toArray(function(err, result) {
	// 		if (err) throw err;
	// 		console.log(result);
	// 		app.get('/crypto', (req, res) => {
	// 			res.json(result);
	// 		});
	// 	});
	//
	// 	client.close();
	// });

	// get stock prices
	client.connect(err => {
		const stockCollection = client.db("test").collection("stock_prices");

		stockCollection.find({}).toArray(function(err, result) {
			if (err) throw err;
			app.get('/stocks', (req, res) => {
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
