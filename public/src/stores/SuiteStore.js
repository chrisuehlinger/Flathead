const AppDispatcher = require('../dispatchers/AppDispatcher');
const Constants = require('../constants/AppConstants');
const BaseStore = require('./BaseStore');
const assign = require('object-assign');
const $ = require('jquery');
const SuiteActionCreators = require('../actions/SuiteActionCreators');
const uuid = require('node-uuid');

// data storage
let _data = {
  suites:[],
  selectedSuiteId: null
};

// add private functions to modify data
function addItem(suite) {
  _data.suites.push(suite);
  _data.selectedSuiteId = suite.id;
  
  $.ajax({
    url:'/suites',
    method: 'POST',
    contentType:'application/json',
    dataType:'json',
    data: JSON.stringify(suite)
  }).then(function(data){
    SuiteActionCreators.replaceAllSuites(data);
  });
}

function createNewItem() {
  console.log('creating');
  var suite = {};
  suite.id = uuid.v4();
  suite.name = "New Suite";
  suite.active = false;
  suite.routes = [];
  addItem(suite);
}


function updateItem(suite) {
  _data.suites.forEach(function(oldSuite, i){
    if(oldSuite.id === suite.id){
      _data.suites[i] = suite;
    }
  });
  
  $.ajax({
    url:'/suites',
    method: 'PUT',
    contentType:'application/json',
    dataType:'json',
    data: JSON.stringify(suite)
  }).then(function(data){
    SuiteActionCreators.replaceAllSuites(data);
  });
}

function deleteItem(suite) {
  _data.suites = _data.suites.filter((oldSuite)=> oldSuite.id !== suite.id);
  
  $.ajax({
    url:'/suites',
    method: 'DELETE',
    contentType:'application/json',
    dataType:'json',
    data: JSON.stringify(suite)
  }).then(function(data){
    SuiteActionCreators.replaceAllSuites(data);
  });
}

function selectItem(suite){
  _data.selectedSuiteId = suite.id;
}

function replaceAll(suites){
  _data.suites = suites;
  
  let selectedSuite = suites.filter((suite) => suite.id === _data.selectedSuiteId)[0];
  console.log('checking selectedSuite', selectedSuite);
  if(!selectedSuite)
    _data.selectedSuiteId = null;
}

// Facebook style store creation.
let SuiteStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    return _data;
  },
  
  getSelectedSuite() {
    return _data.selectedSuite;
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;

    switch(action.type) {
      case Constants.ActionTypes.CREATE_NEW_SUITE:
        createNewItem(action.suite);
        SuiteStore.emitChange();
        break;
        
      case Constants.ActionTypes.ADD_SUITE:
        if (action.suite) {
          addItem(action.suite);
          SuiteStore.emitChange();
        }
        break;
        
        
      case Constants.ActionTypes.UPDATE_SUITE:
        if (action.suite) {
          updateItem(action.suite);
          SuiteStore.emitChange();
        }
        break;
        
      case Constants.ActionTypes.DELETE_SUITE:
        if (action.suite) {
          deleteItem(action.suite);
          SuiteStore.emitChange();
        }
        break;
        
      case Constants.ActionTypes.SELECT_SUITE:
        if (action.suite) {
          selectItem(action.suite);
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
