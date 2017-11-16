const path = require('path');
const routerFactory = require('express').Router;

module.exports = function (db) {
	const router = routerFactory();

	// Canteen Routes

	router.get('/login', (req, res) => {
		res.sendFile('html/canteen_login.html', {root: path.join(__dirname, '../static/')});
	});

	router.post('/signup', (req, res) => {
		db.collection('users').insert({username: req.body.username, password: req.body.password}, err => {
			if (err) {
				console.log(err);
				return res.redirect('/canteen/login');
			}
			res.redirect('/canteen/login');
		});
	});

	router.post('/login', (req, res) => {
		const username = req.body.username;
		const password = req.body.password;
		db.collection('users').findOne({username}, (err, user) => {
			if (err) {
				return res.redirect('/canteen/login');
			}

			if (!user) {
				return res.redirect('/canteen/login');
			}

			if (!(user.password === password)) {
				return res.redirect('/canteen/login');
			}

			req.session.isLoggedIn = true;
			return res.redirect('/canteen/home');
		});
	});

	const isAuthenticated = function (req, res, next) {
		if (req.session.isLoggedIn) {
			return next();
		}
		res.redirect('/canteen/login');
	};

	router.get('/home', isAuthenticated, (req, res) => {
		res.sendFile('html/canteen_staff.html', {root: path.join(__dirname, '../static/')});
	});

	router.get('/logout', isAuthenticated, (req, res) => {
		req.session.isLoggedIn = false;
		res.redirect('/canteen/login');
	});

	// Live orders page
	router.get('/orders', (req, res) => {
		res.sendFile('html/canteen_orders.html', {root: path.join(__dirname, '../static/')});
	});

	// Inventory management page
	router.get('/inventory', (req, res) => {
		res.sendFile('html/check_inventory.html', {root: path.join(__dirname, '../static/')});
	});

	// Menu updation page
	router.get('/menu', (req, res) => {
		res.sendFile('html/canteen_menu.html', {root: path.join(__dirname, '../static/')});
	});

	// Master menu updation page
	router.get('/master_menu', (req, res) => {
		res.sendFile('html/canteen_master_menu.html', {root: path.join(__dirname, '../static/')});
	});

	router.get('/ready_orders', (req, res) => {
		res.sendFile('html/ready_orders.html', {root: path.join(__dirname, '../static/')});
	});

	router.get('/analytics', (req, res) => {
		res.sendFile('html/canteen_analytics.html', {root: path.join(__dirname, '../static/')});
	});

	router.get('/analytics_data', (req, res) => {
		db.collection('orders').aggregate([
			{$unwind: '$items'},
			{$group: {_id: '$items.id', qty: {$sum: '$items.qty'}}},
			{$lookup: {from: 'items', localField: '_id', foreignField: '_id', as: 'actualItem'}},
			{$project: {_id: 1, qty: 1, actualItem: {$arrayElemAt: ['$actualItem', 0]}}},
			{$project: {_id: 1, qty: 1, name: '$actualItem.name'}}
		], (err, result) => {
			if (err) {
				return res.json({error: 'error'});
			}

			return res.json(result);
		});
	});

	return router;
};
