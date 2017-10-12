const Router = require('express').Router;
const ObjectID = require('mongodb').ObjectID;

module.exports = function(db) {
  const router = Router();

  // Ingredient API Routes

  const ingredientsCollection = db.collection('ingredients');

  // get all ingredients
  router.get('/', function(req, res) {
    ingredientsCollection.find({}).toArray(function(err, ingredients) {
      if(err) {
        res.json({'error': 'Unable to fetch ingredients'});
      }
      res.json({'success': ingredients});
    });
  });

  // create new ingredient
  router.post('/', function(req, res) {
    ingredientsCollection.insert({name: req.body.name}, function(err, ingredient) {
      if(err) {
        res.json({'error': 'Unable to insert ingredient'});
      }

      res.json({'success': 'Successfully inserted ingredient'});
    });
  });

  // update a particular ingredient
  router.put('/:id', function(req, res) {

  });

  // delete a particular ingredient
  router.delete('/:id', function(req, res) {
    ingredientsCollection.deleteOne({_id: ObjectID(req.params.id)}, function(err, ingredient) {
      if(err) {
        res.json({'error': `Unable to delete ingredient ${req.params.id}`});
      }

      res.json({'success': `Removed ingredient ${req.params.id}`});
    });
  });

  return router;
};
