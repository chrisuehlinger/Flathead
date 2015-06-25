var express = require('express');
var router = express.Router();

var low = require('lowdb')
var db = low('db.json');

/* GET one of the stored routes. */

router.get('/*', function(req, res) {
  var suite = db('suites').find({active: true});
  var routes = [];
  suite.routes.forEach(function(route){
    if(route.request.method === 'GET' && route.request.url === req.originalUrl){
      routes.push(route);
    }
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
