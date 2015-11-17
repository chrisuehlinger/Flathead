var express = require('express');
var router = express.Router();
var path = require('path');

var low = require('lowdb');
var dbPath = path.resolve(__dirname, '../db.json');

function routing(req,res,method){

};

/* GET/POST/PUT/DELETE/etc one of the stored routes. */

router.all('/*', function(req, res) {
  var db = low(dbPath, {
    async: false
  });
  
  var suites = db('suites').where({active: true});
  var routes = [];
  suites.forEach(function(suite){
    suite.routes.forEach(function(route){
      if(route.request.method === req.method && route.request.url === req.originalUrl){
        routes.push(route);
      }
    });
  });
  
  var matchingRoute = routes[0];
  if(matchingRoute){
    res.type('json');
    res.send(matchingRoute.response.content.text);
  } else {
    res.send('');
  }
});

module.exports = router;
