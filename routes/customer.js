const Router = require('express').Router;
const path = require('path');
module.exports = function(db, wss) {
  const router = Router();

  // Customer Routes

  // menu viewing and ordering page
  router.get('/menu', function(req, res) {
    res.sendFile('html/customer_menu.html', {root: path.join(__dirname, '../static/')});
  });

  return router;
}
