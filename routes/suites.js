var express = require('express');
var router = express.Router();
var path = require('path');

var low = require('lowdb')
var argv = require('yargs').argv;
var dbPath = argv.db ? path.resolve(argv.db) : path.resolve(__dirname, '../db.json');
var db = low(dbPath, {
  async: false
});

/* GET a list of all the stored suites */

router.get('/', function(req, res) {
    res.send(db('suites'));
});

/* POST a new suite */

router.post('/', function(req, res) {
    console.log(req.body);
    db('suites').push(req.body);
    res.send(db('suites'));
});

/* PUT a modified suite */

router.put('/', function(req, res) {
    var modifiedSuite = req.body;
    db('suites')
      .chain()
      .find({ id: modifiedSuite.id })
      .assign(modifiedSuite)
      .value();
    res.send(db('suites'));
});

/* DELETE a suite */

router.delete('/', function(req, res) {
    var modifiedSuite = req.body;
    db('suites').remove({id: modifiedSuite.id});
    res.send(db('suites'));
});

/* POST a new route */

router.post('/:suiteId/routes', function(req, res) {
    console.log(req.body);
    db('suites').find({id: req.params.suiteId}).routes.unshift(req.body);
    res.send(db('suites'));
});

/* PUT a modified route */

router.put('/:suiteId/routes', function(req, res) {
    var modifiedRoute = req.body;
    console.log(modifiedRoute);
    db('suites')
      .chain()
      .find({ id: req.params.suiteId })
      .get('routes')
      .find({id: modifiedRoute.id})
      .assign(modifiedRoute).value();
  
  console.log(db('suites')
      .chain()
      .find({ id: req.params.suiteId })
      .get('routes').find({id: modifiedRoute.id}).value());
    res.send(db('suites'));
});

/* DELETE a route */

router.delete('/:suite/routes', function(req, res) {
//    var modifiedSuite = req.body;
//    db('suites').remove({id: modifiedSuite.id});
//    res.send(db('suites'));
});

module.exports = router;
