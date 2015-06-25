var express = require('express');
var router = express.Router();

var low = require('lowdb')
var db = low('db.json');

/* GET a list of all the stored routes */

router.get('/', function(req, res) {
    res.send(db('suites'));
});

module.exports = router;
