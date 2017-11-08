const Router = require('express').Router;
const ObjectID = require('mongodb').ObjectID;

module.exports = function(db) {
  const router = Router();

  // Item API Routes

  const itemsCollection = db.collection('items');

  // get all items
  router.get('/', function(req, res) {
    itemsCollection.find({}).toArray(function(err, items) {
      if(err) {
        res.json({'error': 'Unable to fetch items'});
      }
      res.json({'success': items});
    });
  });

  // create new item
  router.post('/', function(req, res) {
    itemsCollection.insert({name: req.body.name, rate: req.body.rate}, function(err, result) {
      if(err) {
        res.json({'error': 'Unable to insert item'});
      }

      res.json({'success': result.insertedIds[0]});
    });
  });

  // read particular item
  router.get('/:id', function(req, res) {
    itemsCollection.findOne({_id: ObjectID(req.params.id)}, function(err, item) {
      if(err) {
        res.json({'error': `Unable to fetch item ${req.params.id}`});
      }

      res.json({'success': item});
    });
  });

  // update particular item
  router.put('/:id', function(req, res) {

  });

  // delete particular item
  router.delete('/:id', function(req, res) {
    itemsCollection.deleteOne({_id: ObjectID(req.params.id)}, function(err, item) {
      if(err) {
        res.json({'error': `Unable to delete item ${req.params.id}`});
      }

      res.json({'success': `Removed item ${req.params.id}`});
    });
  });

  return router;
};
