const React = require('react');
const SuiteEditor = require('./SuiteEditor.jsx');
const SuiteList = require('./SuiteList.jsx');
const SuiteStore = require('../stores/SuiteStore');

let App = React.createClass({
  getInitialState() {
  
    return {
      suites: [],
      selectedSuite: null
    };
  },

  _onChange() {
    this.setState(SuiteStore.getAll());
  },
  
  _onSuiteSelect(suite){
    this.setState({selectedSuite: suite});
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
        <SuiteList suites={this.state.suites} selectSuite={this._onSuiteSelect}/>
        <SuiteEditor suite={this.state.selectedSuite} />
      </div>
    );
  }
});


setTimeout(()=> SuiteStore.emitChange());
module.exports = App;
