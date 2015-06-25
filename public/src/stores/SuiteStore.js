const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');

// data storage
let _data = [];

// add private functions to modify data
function addItem(suite) {
  _data.push(suite);
}

function replaceAll(suites){
  _data = suites;
}

// Facebook style store creation.
let SuiteStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    return {
      suites: _data
    };
  },
  
  

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;

    switch(action.type) {
      case Constants.ActionTypes.ADD_SUITE:
        if (action.suite) {
          addItem(action.suite);
          SuiteStore.emitChange();
        }
        break;
        
      case Constants.ActionTypes.REPLACE_ALL_SUITES:
        if (action.suites) {
          replaceAll(action.suites);
          SuiteStore.emitChange();
        }
        break;

      // add more cases for other actionTypes...
    }
  })

});

module.exports = SuiteStore;
