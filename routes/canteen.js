const path = require('path');
const routerFactory = require('express').Router;

module.exports = function () {
	const router = routerFactory();

	// Canteen Routes

	router.get('/home', (req, res) => {
		res.sendFile('html/canteen_staff.html', {root: path.join(__dirname, '../static/')});
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

	return router;
};
