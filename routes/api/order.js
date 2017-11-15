const routerFactory = require('express').Router;
const objectID = require('mongodb').ObjectID;

module.exports = function (db, wss) {
	const router = routerFactory();

	// Order API Routes
	const ordersCollection = db.collection('orders');

	// Get all orders
	router.get('/', (req, res) => {
		let cursor;
		req.query.status = parseInt(req.query.status, 10);
		if (req.query.status === 0) {
			cursor = ordersCollection.find({status: 0});
		} else if (req.query.status === 1) {
			cursor = ordersCollection.find({status: 1}).sort({servicedTime: -1});
		} else if (req.query.status === 2) {
			cursor = ordersCollection.find({status: 2});
		} else {
			cursor = ordersCollection.find({});
		}
		cursor.toArray((err, orders) => {
			if (err) {
				return res.json({error: 'Unable to fetch orders'});
			}
			res.json({success: orders});
		});
	});

	// Create a new order
	router.post('/', (req, res) => {
		ordersCollection.insert({items: req.body.items, status: -1}, (err, result) => {
			if (err) {
				return res.json({error: 'Unable to insert order'});
			}
			res.json({success: result.insertedIds[0]});
		});
	});

	router.put('/:id', (req, res) => {
		let update;
		if (parseInt(req.body.status, 10) === 0) {
			update = {$set: {status: 0, placedTime: Date.now()}};
		} else if (parseInt(req.body.status, 10) === 1) {
			update = {$set: {status: 1, servicedTime: Date.now()}};
		} else if (parseInt(req.body.status, 10) === 2) {
			update = {$set: {status: 2, archivedTime: Date.now()}};
		}
		ordersCollection.updateOne({_id: objectID(req.params.id)}, update, err => {
			if (err) {
				return res.json({error: `Unable to change status of order ${req.params.id} to ${req.body.status}`});
			}
			ordersCollection.find({_id: objectID(req.params.id)}).toArray((err, findResult) => {
				if (err) {
					res.json({error: `Unable to change status of order ${req.params.id} to ${req.body.status}`});
				}

				if (parseInt(req.body.status, 10) === 0) {
					wss.broadcast(JSON.stringify({placedOrder: {id: req.params.id, items: findResult[0].items}}));
				} else if (parseInt(req.body.status, 10) === 1) {
					wss.broadcast(JSON.stringify({servicedOrder: req.params.id}));
				}
				res.json({success: `Order ${req.params.id} to Status ${req.body.status}`});
			});
		});
	});

	router.delete('/:id', (req, res) => {
		ordersCollection.deleteOne({_id: objectID(req.params.id)}, err => {
			if (err) {
				return res.json({error: `Unable to delete order ${req.params.id}`});
			}

			res.json({success: `Removed order ${req.params.id}`});
		});
	});

	return router;
};
