const MongoClient = require('mongodb').MongoClient;
const requestPromise = require('request-promise');
const moment = require('moment-timezone');
const Promise = require('bluebird');
const _ = require('lodash');
var util = require('util');
global.Promise = Promise;

const now = moment().format();

async function main() {

	let response = await requestPromise({
		url: ``,
		method: 'POST'
	});

	console.log("hi");

} // end async main function

main();