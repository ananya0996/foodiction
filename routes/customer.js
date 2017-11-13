const path = require('path');
const routerFactory = require('express').Router;

module.exports = function () {
	const router = routerFactory();

	// Customer Routes

	// menu viewing and ordering page
	router.get('/menu', (req, res) => {
		res.sendFile('html/customer_menu.html', {root: path.join(__dirname, '../static/')});
	});

	router.get('/order_placed', (req, res) => {
		res.sendFile('html/order_placed.html', {root: path.join(__dirname, '../static/')});
	});

	router.get('/order_error', (req, res) => {
		res.sendFile('html/order_error.html', {root: path.join(__dirname, '../static/')});
	});

	router.get('/process_payment', (req, res) => {
		res.sendFile('html/process_payment.html', {root: path.join(__dirname, '../static/')});
	});

	return router;
};
