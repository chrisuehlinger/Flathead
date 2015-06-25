var express = require('express');
var router = express.Router();

var low = require('lowdb')
var db = low('db.json');

/* GET one of the stored routes. */

router.get('/', function(req, res) {
    res.send('respond with a resource');
});

module.exports = router;
