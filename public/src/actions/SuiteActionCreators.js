var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {

  addItem: function(text) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.ADD_TASK,
      text: text
    });
  },

  replaceAllSuites: function(suites) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.REPLACE_ALL_SUITES,
      suites: suites
    });
  }

};
