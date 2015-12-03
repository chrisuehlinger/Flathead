var express = require('express');
var router = express.Router();
var package = require('../package.json');

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('admin', {title: 'Flathead', version: 'v' + package.version});
});

module.exports = router;
