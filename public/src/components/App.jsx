const React = require('react');
const SuiteEditor = require('./SuiteEditor.jsx');
const SuiteList = require('./SuiteList.jsx');
const SuiteStore = require('../stores/SuiteStore');
const SuiteActionCreators = require('../actions/SuiteActionCreators');

var mui = require('material-ui');

let App = React.createClass({
  getInitialState() {
  
    return {
      suites: [],
      selectedSuiteId: null
    };
  },

  _onChange() {
    this.setState(SuiteStore.getAll());
  },
  
  _onSuiteSelect(suite){
    SuiteActionCreators.selectSuite(suite);
  },

  componentDidMount() {
    SuiteStore.addChangeListener(this._onChange);
  },

  componentWillUnmount() {
    SuiteStore.removeChangeListener(this._onChange);
  },

  render() {
    let selectedSuite = this.state.suites.filter((suite) => suite.id === this.state.selectedSuiteId )[0];
    return (
      <div className="wrapper">
        <SuiteList suites={this.state.suites} selectSuite={this._onSuiteSelect}/>
        <SuiteEditor suite={selectedSuite} />
      </div>
    );
  }
});

module.exports = App;
