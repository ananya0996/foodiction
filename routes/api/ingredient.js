const routerFactory = require('express').Router;
const objectID = require('mongodb').ObjectID;

module.exports = function (db) {
	const router = routerFactory();

	// Ingredient API Routes

	const ingredientsCollection = db.collection('ingredients');

	// Get all ingredients
	router.get('/', (req, res) => {
		ingredientsCollection.find({}).toArray((err, ingredients) => {
			if (err) {
				return res.json({error: 'Unable to fetch ingredients'});
			}
			res.json({success: ingredients});
		});
	});

	// Create new ingredient
	router.post('/', (req, res) => {
		ingredientsCollection.insert({name: req.body.name, quantity: req.body.quantity}, (err, result) => {
			if (err) {
				return res.json({error: 'Unable to insert ingredient'});
			}

			res.json({success: result.insertedIds[0]});
		});
	});

	// Update a particular ingredient
	router.put('/:id', (req, res) => {
		ingredientsCollection.updateOne({_id: objectID(req.params.id)}, {$inc: {quantity: req.body.quantity}}, err => {
			if (err) {
				return res.json({error: 'Unable to update quantity'});
			}
			ingredientsCollection.find({_id: objectID(req.params.id)}).toArray(err => {
				if (err) {
					return res.json({error: 'Unable to update quantity'});
				}

				return res.json({success: 'Updated quantity'});
			});
		});
	});

	// Delete a particular ingredient
	router.delete('/:id', (req, res) => {
		ingredientsCollection.deleteOne({_id: objectID(req.params.id)}, err => {
			if (err) {
				return res.json({error: `Unable to delete ingredient ${req.params.id}`});
			}

			res.json({success: `Removed ingredient ${req.params.id}`});
		});
	});

	return router;
};
