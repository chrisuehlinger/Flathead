const React = require('react');
const $ = require('jquery');
const App = require('./components/App.jsx');
const SuiteActionCreators = require('./actions/SuiteActionCreators');

React.render(<App />, document.getElementById('main'));

console.log('fetching');
$.ajax('/suites').then(function(data){
  SuiteActionCreators.replaceAllSuites(data);
});