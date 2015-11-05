const React = require('react');
const ReactDOM = require('react-dom');

let injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

const $ = require('jquery');
const App = require('./components/App.jsx');
const SuiteActionCreators = require('./actions/SuiteActionCreators');

ReactDOM.render(<App />, document.getElementById('main'));

$.ajax('/suites').then(function(data){
  SuiteActionCreators.replaceAllSuites(data);
});