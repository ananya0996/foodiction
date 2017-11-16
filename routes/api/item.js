const routerFactory = require('express').Router;
const objectID = require('mongodb').ObjectID;

module.exports = function (db) {
	const router = routerFactory();

	// Item API Routes

	const itemsCollection = db.collection('items');

	// Get all items
	router.get('/', (req, res) => {
		itemsCollection.find({indailymenu: true}).toArray((err, items) => {
			if (err) {
				return res.json({error: 'Unable to fetch items'});
			}
			res.json({success: items});
		});
	});

	// Get master menu items
	router.get('/master_menu_items', (req, res) => {
		itemsCollection.find({}).toArray((err, items) => {
			if (err) {
				return res.json({error: 'Unable to fetch items'});
			}
			res.json({success: items});
		});
	});

	// Create new item
	router.post('/', (req, res) => {
		itemsCollection.updateOne({_id: objectID(req.body.id)}, {$set: {indailymenu: true}}, {upsert: true}, (err, result) => {
			if (err) {
				return res.json({error: 'Unable to insert item'});
			}

			res.json({success: result.modifiedCount});
		});
	});

	router.delete('/:id', (req, res) => {
		itemsCollection.updateOne({_id: objectID(req.params.id)}, {$set: {indailymenu: false}}, err => {
			if (err) {
				return res.json({error: `Unable to delete item ${req.params.id}`});
			}
			res.json({success: `Removed item ${req.params.id}`});
		});
	});

	// Create new master menu item
	router.post('/master_menu_item', (req, res) => {
		req.body.ingredients = req.body.ingredients.map(ingredient => Object.assign(ingredient, {_id: objectID(ingredient._id), quantity: parseInt(ingredient.quantity, 10)}));
		itemsCollection.updateOne({name: req.body.name, rate: req.body.rate}, {$set: {name: req.body.name, rate: req.body.rate, indailymenu: false, ingredients: req.body.ingredients}}, {upsert: true}, (err, result) => {
			if (err) {
				return res.json({error: 'Unable to insert item'});
			}
			res.json({success: result.upsertedId});
		});
	});

	// Read particular item
	router.get('/:id', (req, res) => {
		itemsCollection.findOne({_id: objectID(req.params.id)}, (err, item) => {
			if (err) {
				return res.json({error: `Unable to fetch item ${req.params.id}`});
			}

			res.json({success: item});
		});
	});

	// Delete particular master menu item
	router.delete('/master_menu_item/:id', (req, res) => {
		itemsCollection.deleteOne({_id: objectID(req.params.id)}, err => {
			if (err) {
				return res.json({error: `Unable to delete item ${req.params.id}`});
			}
			res.json({success: `Removed item ${req.params.id}`});
		});
	});

	return router;
};
