var AppDispatcher = require('../dispatchers/AppDispatcher');
var Constants = require('../constants/AppConstants');

module.exports = {
  createNewSuite: function() {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.CREATE_NEW_SUITE
    });
  },
  
  addSuite: function(suite) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.ADD_SUITE,
      suite: suite
    });
  },
  
  updateSuite: function(suite) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.UPDATE_SUITE,
      suite: suite
    });
  },
  
  deleteSuite: function(suite) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.DELETE_SUITE,
      suite: suite
    });
  },
  
  selectSuite: function(suite) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.SELECT_SUITE,
      suite: suite
    });
  },

  replaceAllSuites: function(suites) {
    AppDispatcher.handleViewAction({
      type: Constants.ActionTypes.REPLACE_ALL_SUITES,
      suites: suites
    });
  }
};
