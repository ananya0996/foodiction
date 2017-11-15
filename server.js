const http = require('http');
const path = require('path');
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
		cronTime: ' * * *',
		onTick: async () => {
			// TODO
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
