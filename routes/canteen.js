const Router = require('express').Router;
const path = require('path');
module.exports = function(db, wss) {
  const router = Router();

  // Canteen Routes

  // login page
  router.get('/login', function(req, res) {

  });

  // login action
  router.post('/login', function(req, res) {

  });

  // logout action
  router.post('/logout', function(req, res) {

  });

  router.get('/home', function(req, res) {
    res.sendFile('html/canteen_staff.html', {root: path.join(__dirname, '../static/')});
  });

  // live orders page
  router.get('/orders', function(req, res) {
    res.sendFile('html/canteen_orders.html', {root: path.join(__dirname, '../static/')});
  });

  // inventory management page
  router.get('/inventory', function(req, res) {
    res.sendFile('html/check_inventory.html', {root: path.join(__dirname, '../static/')});
  });

  // menu updation page
  router.get('/menu', function(req, res) {
    res.sendFile('html/canteen_menu.html', {root: path.join(__dirname, '../static/')});
  });

  return router;
};
