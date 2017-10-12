const Router = require('express').Router;
const ObjectID = require('mongodb').ObjectID;

module.exports = function(db, wss) {
  const router = Router();

  // Order API Routes
  const ordersCollection = db.collection('orders');

  // get all orders
  router.get('/', function(req, res) {
    ordersCollection.find({}).toArray(function(err, orders) {
      if(err) {
        res.json({'error': 'Unable to fetch orders'});
      }
      res.json({'success': orders});
    });
  });

  // create a new order
  router.post('/', function(req, res) {
    ordersCollection.insert({items: req.body.items}, function(err, result) {
      if(err) {
        res.json({'error': 'Unable to insert order'});
      }
      wss.broadcast(JSON.stringify({'newOrder': {id: result.insertedIds[0], items: req.body.items}}));
      res.json({'success': result.insertedIds[0]});
    });
  });

  router.delete('/:id', function(req, res) {
    ordersCollection.deleteOne({_id: ObjectID(req.params.id)}, function(err, order) {
      if(err) {
        res.json({'error': `Unable to delete order ${req.params.id}`});
      }

      res.json({'success': `Removed order ${req.params.id}`});
    });
  });

  return router;
};
