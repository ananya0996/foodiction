const Router = require('express').Router;
const ObjectID = require('mongodb').ObjectID;

module.exports = function(db) {
  const router = Router();

  // Item API Routes

  const itemsCollection = db.collection('items');
  const masterMenuItemsCollection = db.collection('master_menu_items');

  // get all items
  router.get('/', function(req, res) {
    itemsCollection.find({}).toArray(function(err, items) {
      if(err) {
        res.json({'error': 'Unable to fetch items'});
      }
      res.json({'success': items});
    });
  });

  // get master menu items
  router.get('/master_menu_items', function(req, res) {
    masterMenuItemsCollection.find({}).toArray(function(err, items) {
      if(err) {
        res.json({'error': 'Unable to fetch items'});
      }
      res.json({'success': items});
    });
  });
//   itemsCollection.update({name: req.body.name, rate: req.body.rate, date: req.body.date}, { $set: {name: req.body.name, rate: req.body.rate, date: req.body.date}}, function(err, result)
  // create new item
  router.post('/', function(req, res) {
    itemsCollection.updateMany({name: req.body.name, rate: req.body.rate, date: req.body.date}, {$set: {name: req.body.name, rate: req.body.rate, date: req.body.date}}, {"upsert" : true}, function(err, result) {
      if(err) {
        res.json({'error': 'Unable to insert item'});
      }

      res.json({'success': result.updatedIds[0]});
    });
  });

  // create new master menu item
  router.post('/master_menu_item', function(req, res) {
    masterMenuItemsCollection.insert({name: req.body.name, rate: req.body.rate}, function(err, result) {
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

  // delete particular master menu item
  router.delete('/master_menu_item/:id', function(req, res) {  
    masterMenuItemsCollection.deleteOne({_id: ObjectID(req.params.id)}, function(err, item) {
      if(err) {
        res.json({'error': `Unable to delete item ${req.params.id}`});
      }

      res.json({'success': `Removed item ${req.params.id}`});
    });
  });

  return router;
};
