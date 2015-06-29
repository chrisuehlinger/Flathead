var express = require('express');
var router = express.Router();

var low = require('lowdb');

/* GET one of the stored routes. */

router.get('/*', function(req, res) {
  var db = low('db.json', {
    async: false
  });
  
  var suite = db('suites').find({active: true});
  console.log('Answering: ', suite);
  var routes = [];
  suite.routes.forEach(function(route){
    if(route.request.method === 'GET' && route.request.url === req.originalUrl){
      routes.push(route);
    }
  });
  
  var matchingRoute = routes[0];
  console.log('Matching route: ', matchingRoute);
  if(matchingRoute){
    res.type('json');
    res.send(matchingRoute.response.content.text);
  } else {
    res.send('');
  }
  
  
});

module.exports = router;
