var express = require('express');
var router = express.Router();

var low = require('lowdb')
var db = low('db.json', {
  async: false
});

/* GET a list of all the stored routes */

router.get('/', function(req, res) {
    res.send(db('suites'));
});

/* POST a new route */

router.post('/', function(req, res) {
    db('suites').push(req.body);
    res.send(db('suites'));
});

/* PUT a modified route */

router.put('/', function(req, res) {
    var modifiedSuite = req.body;
    db('suites')
      .chain()
      .find({ id: modifiedSuite.id })
      .assign(modifiedSuite)
      .value();
    res.send(db('suites'));
});

/* DELETE a route */

router.delete('/', function(req, res) {
    var modifiedSuite = req.body;
    db('suites').remove({id: modifiedSuite.id});
    res.send(db('suites'));
});

module.exports = router;
