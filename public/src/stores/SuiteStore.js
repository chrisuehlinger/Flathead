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
function addSuite(suite) {
  suite.id = uuid.v4();
  suite.routes.forEach(function(route){
      route.id = uuid.v4();
  });
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

function createNewSuite() {
  console.log('creating');
  var suite = {};
  suite.id = uuid.v4();
  suite.name = "New Suite";
  suite.active = true;
  suite.routes = [];
  addSuite(suite);
}


function updateSuite(suite) {
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

function deleteSuite(suite) {
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

function selectSuite(suite){
  _data.selectedSuiteId = suite.id;
}

function replaceAll(suites){
  _data.suites = suites;
  
  let selectedSuite = suites.filter((suite) => suite.id === _data.selectedSuiteId)[0];
  if(!selectedSuite)
    _data.selectedSuiteId = null;
}

function addRoute(suiteId, route, isCopy) {
  $.ajax({
    url:'/suites/' + suiteId + '/routes?copy=' + isCopy,
    method: 'POST',
    contentType:'application/json',
    dataType:'json',
    data: JSON.stringify(route)
  }).then(function(data){
    SuiteActionCreators.replaceAllSuites(data);
  });
}

function updateRoute(suiteId, route) {
  $.ajax({
    url:'/suites/' + suiteId + '/routes',
    method: 'PUT',
    contentType:'application/json',
    dataType:'json',
    data: JSON.stringify(route)
  }).then(function(data){
    SuiteActionCreators.replaceAllSuites(data);
  });
}

function deleteRoute(suiteId, route) {
  $.ajax({
    url:'/suites/' + suiteId + '/routes',
    method: 'DELETE',
    contentType:'application/json',
    dataType:'json',
    data: JSON.stringify(route)
  }).then(function(data){
    SuiteActionCreators.replaceAllSuites(data);
  });
}

// Facebook style store creation.
let SuiteStore = assign({}, BaseStore, {

  // public methods used by Controller-View to operate on data
  getAll() {
    return _data;
  },
  
  getSelectedSuite() {
    return _data.selectedSuiteId;
  },

  // register store with dispatcher, allowing actions to flow through
  dispatcherIndex: AppDispatcher.register(function(payload) {
    let action = payload.action;

    switch(action.type) {
      case Constants.ActionTypes.CREATE_NEW_SUITE:
        createNewSuite(action.suite);
        SuiteStore.emitChange();
        break;
        
      case Constants.ActionTypes.ADD_SUITE:
        if (action.suite) {
          addSuite(action.suite);
          SuiteStore.emitChange();
        }
        break;
        
        
      case Constants.ActionTypes.UPDATE_SUITE:
        if (action.suite) {
          updateSuite(action.suite);
          SuiteStore.emitChange();
        }
        break;
        
      case Constants.ActionTypes.DELETE_SUITE:
        if (action.suite) {
          deleteSuite(action.suite);
          SuiteStore.emitChange();
        }
        break;
        
      case Constants.ActionTypes.SELECT_SUITE:
        if (action.suite) {
          selectSuite(action.suite);
          SuiteStore.emitChange();
        }
        break;
        
      case Constants.ActionTypes.REPLACE_ALL_SUITES:
        if (action.suites) {
          replaceAll(action.suites);
          SuiteStore.emitChange();
        }
        break;
        
      case Constants.ActionTypes.ADD_ROUTE:
        if (action.suiteId && action.route) {
          addRoute(action.suiteId, action.route, action.isCopy);
          SuiteStore.emitChange();
        }
        break;
        
        
      case Constants.ActionTypes.UPDATE_ROUTE:
        if (action.suiteId && action.route) {
          updateRoute(action.suiteId, action.route);
          SuiteStore.emitChange();
        }
        break;
        
      case Constants.ActionTypes.DELETE_ROUTE:
        if (action.suiteId && action.route) {
          deleteRoute(action.suiteId, action.route);
          SuiteStore.emitChange();
        }
        break;

      // add more cases for other actionTypes...
    }
  })

});

module.exports = SuiteStore;
