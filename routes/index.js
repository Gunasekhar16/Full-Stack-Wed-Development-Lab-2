var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'contack Database application', message: 'welcome to the contack daatabase application with is made using node.js and express' });
});

module.exports = router;
