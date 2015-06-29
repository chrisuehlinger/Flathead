var express = require('express');
var router = express.Router();

var low = require('lowdb');

function routing(req,res,method){
  var db = low('db.json', {
    async: false
  });
  
  var suite = db('suites').find({active: true});
  console.log('Answering: ', suite);
  var routes = [];
  suite.routes.forEach(function(route){
    if(route.request.method === method && route.request.url === req.originalUrl){
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
};

/* GET one of the stored routes. */

router.get('/*', function(req, res) {
  routing(req, res, 'GET');
});

/* POST one of the stored routes. */

router.post('/*', function(req, res) {
  routing(req, res, 'POST');
});

/* PUT one of the stored routes. */

router.put('/*', function(req, res) {
  routing(req, res, 'PUT');
});

/* DELETE one of the stored routes. */

router.delete('/*', function(req, res) {
  routing(req, res, 'DELETE');
});

module.exports = router;
