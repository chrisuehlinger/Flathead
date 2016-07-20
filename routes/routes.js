var express = require('express');
var router = express.Router();
var path = require('path');

var low = require('lowdb');
var argv = require('yargs').argv;
var dbPath = argv.db ? path.resolve(argv.db) : path.resolve(__dirname, '../db.json');

/* GET/POST/PUT/DELETE/etc one of the stored routes. */

router.all('/*', function(req, res) {
  if(req.method === 'OPTIONS'){
    res.sendStatus(200);
    return;
  }
  
  var db = low(dbPath, {
    async: false
  });
  
  var suites = db('suites').where({active: true});
  var routes = [];
  var routeWildcards = [];
  suites.forEach(function(suite){
    suite.routes.forEach(function(route){
      if(route.request.method === req.method) {
        if(route.request.url.indexOf('*') !== -1){
          var routeRegex = new RegExp('^' + route.request.url.replace(/\*/g, "[^ ]*") + '$');
          if(routeRegex.test(req.originalUrl)){
              routeWildcards.push(route);
          }
        } else if(route.request.url === req.originalUrl){
          routes.push(route);
        }
      }
    });
  });
  
  var matchingRoute = routes[0] || routeWildcards[0];
  if(matchingRoute){
    res.type('json');
    if(req.method !== 'GET' && matchingRoute.response.mirrorRequest){
      res.send(req.body);
    } else {
      res.send(matchingRoute.response.content.text);
    }
  } else if(req.originalUrl === '/'){
    res.redirect('/admin');
  } else {
    res.sendStatus(404);
  }
});

module.exports = router;
