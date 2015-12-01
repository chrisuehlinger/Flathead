var express = require('express');
var router = express.Router();
var path = require('path');

var low = require('lowdb');
var dbPath = path.resolve(__dirname, '../db.json');

function routing(req,res,method){

};

/* GET/POST/PUT/DELETE/etc one of the stored routes. */

router.all('/*', function(req, res) {
  if(req.method === 'OPTIONS'){
    res.send(200);
    return;
  }
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
  } else if(req.originalUrl === '/'){
    res.redirect('/admin');
  } else {
    res.send(404);
  }
});

module.exports = router;
