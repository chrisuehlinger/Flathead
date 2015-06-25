const React = require('react');
const SuiteEditor = require('./SuiteEditor.jsx');
const SuiteList = require('./SuiteList.jsx');
const SuiteStore = require('../stores/SuiteStore');

var mui = require('material-ui');
var ThemeManager = new mui.Styles.ThemeManager();

let App = React.createClass({
  getInitialState() {
  
    return {
      suites: [],
      selectedSuite: null
    };
  },
  
  getChildContext() { 
    return {
      muiTheme: ThemeManager.getCurrentTheme()
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

App.childContextTypes = {
  muiTheme: React.PropTypes.object
};

module.exports = App;
