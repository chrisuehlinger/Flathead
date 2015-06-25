const React = require('react');
const SuiteEditor = require('./SuiteEditor.jsx');
const SuiteList = require('./SuiteList.jsx');
const SuiteStore = require('../stores/SuiteStore');

let App = React.createClass({
  getInitialState() {
  
    return {
      suites: []
    };
  },

  _onChange() {
    console.log('Change!',SuiteStore.getAll());
    this.setState(SuiteStore.getAll());
  },

  componentDidMount() {
    SuiteStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    SuiteStore.removeChangeListener(this._onChange);
  },

  render() {
    return (
      <div className="wrapper">
        <SuiteList suites={this.state.suites}/>
        <SuiteEditor />
      </div>
    );
  }
});


setTimeout(()=> SuiteStore.emitChange());
module.exports = App;
