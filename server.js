const http = require('http');
const path = require('path');
const util = require('util');
const express = require('express');
const ws = require('ws');
const session = require('express-session');
const bodyParser = require('body-parser');
const cron = require('cron');
const customerRoutes = require('./routes/customer');
const canteenRoutes = require('./routes/canteen');
const ingredientApiRoutes = require('./routes/api/ingredient');
const itemApiRoutes = require('./routes/api/item');
const orderApiRoutes = require('./routes/api/order');

function run(db) {
	const app = express();

	// HTTP Server Middleware
	app.use(bodyParser.urlencoded({extended: false}));
	app.use(bodyParser.json());
	app.use(session({
		secret: 'keyboard cat', // Eventually from config
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: true
		}
	}));
	app.use(express.static('./static'));

	// HTTP Server Routes
	app.get('/', (req, res) => {
		res.sendFile('html/temp_home.html', {root: path.join(__dirname, './static/')});
	});

	const server = http.createServer(app);
	const wss = new ws.Server({server});

	app.use('/customer', customerRoutes(db, wss));
	app.use('/canteen', canteenRoutes(db, wss));
	app.use('/api/ingredient', ingredientApiRoutes(db));
	app.use('/api/item', itemApiRoutes(db));
	app.use('/api/order', orderApiRoutes(db, wss));

	wss.broadcast = function (data) {
		wss.clients.forEach(client => {
			if (client.readyState === ws.OPEN) {
				client.send(data);
			}
		});
	};

	const inventoryJob = new cron.CronJob({
		cronTime: '* * * * *', // Y '00 00 18 * * *' '00 05 * * * *'
		onTick: async () => {
			const itemsCollection = db.collection('items');
			const ingredientsCollection = db.collection('ingredients');
			itemsCollection.aggregate = util.promisify(itemsCollection.aggregate);
			ingredientsCollection.update = util.promisify(ingredientsCollection.update);

			console.log('tick');
			try {
				const aggrResult = await itemsCollection.aggregate([
					{$match: {indailymenu: true}},
					{$unwind: '$ingredients'},
					{$project: {_id: 1, ingredients: {_id: '$ingredients._id', quantity: {$multiply: ['$ingredients.quantity', 100]}}}},
					{$group: {_id: '$ingredients._id', quantity: {$sum: '$ingredients.quantity'}}},
					{$lookup: {from: 'ingredients', localField: '_id', foreignField: '_id', as: 'actualItem'}},
					{$project: {_id: 1, toSubtract: '$quantity', actualItem: {$arrayElemAt: ['$actualItem', 0]}}},
					{$project: {_id: 1, name: '$actualItem.name', price: '$actualItem.price', quantity: {$subtract: ['$actualItem.quantity', '$toSubtract']}}}
				]);
				await Promise.all(aggrResult.map(ingredientDoc => ingredientsCollection.update({_id: ingredientDoc._id}, ingredientDoc)));
				const cursor = ingredientsCollection.find({});
				cursor.toArray = util.promisify(cursor.toArray);
				const ingredients = await cursor.toArray();
				console.log(ingredients);
				console.log(JSON.stringify({inventoryUpdate: ingredients}));
				wss.broadcast(JSON.stringify({inventoryUpdate: ingredients}));
			} catch (err) {
				console.log(err);
			}
		},
		start: false,
		timeZone: 'Asia/Kolkata'
	});

	return new Proxy(server, {
		get(target, propKey) {
			if (propKey === 'listen') {
				inventoryJob.start();
			}
			return target[propKey];
		}
	});
}

module.exports = run;
