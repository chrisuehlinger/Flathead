const React = require('react');
const RouteEditor = require('./RouteEditor.jsx');
const SuiteActionCreators = require('../actions/SuiteActionCreators');
const mui = require('material-ui');

let {RaisedButton, Toggle, TextField} = mui;

let SuiteEditor = React.createClass({
  getInitialProps() {
    return {
      suite: null
    };
  },

  _saveSuite(){
    var newSuite = {
      id: this.props.suite.id,
      name: this.refs.nameInput.getValue(),
      active: this.refs.activeToggle.isToggled(),
      routes: this.props.suite.routes
    };
    console.log('Saving', newSuite);
    SuiteActionCreators.updateSuite(newSuite);
  },

  _deleteSuite(){
    SuiteActionCreators.deleteSuite(this.props.suite);
  },
  
  render() {
    console.log('Now editing:', this.props.suite);
    if(this.props.suite){
      return (
        <div className="suite-editor">
          <div className="suite-editor-buttons">
            <RaisedButton label="Save" onClick={this._saveSuite} />
            <RaisedButton label="Delete" onClick={this._deleteSuite} />
          </div>
          <div className="suite-metadata-editor">
            <TextField 
                floatingLabelText="Name" 
                fullWidth={true}
                ref="nameInput" 
                defaultValue={this.props.suite.name} />
            <Toggle label="Active" defaultToggled={this.props.suite.active} ref="activeToggle" />
          </div>
          <hr />
          <h3>Routes</h3>
            <ul className="route-list">
              { this.props.suite.routes.map((route) => <li key={route.request.url}> <RouteEditor route={route} /></li>)}
            </ul>
        </div>
      );
    } else {
      return (
        <div className="suite-editor">
          This will be an area for editing suites.
        </div>
      );
    }
  }
});

module.exports = SuiteEditor;
