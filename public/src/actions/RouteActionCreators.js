var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {
  addRoute: function(suiteId, route) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.ADD_ROUTE,
      suiteId: suiteId,
      route: route
    });
  },
  
  updateRoute: function(suiteId, route) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.UPDATE_ROUTE,
      suiteId: suiteId,
      route: route
    });
  },
  
  deleteRoute: function(suiteId, route) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.DELETE_ROUTE,
      suiteId: suiteId,
      route: route
    });
  }
};
