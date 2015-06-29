const React = require('react');
const RouteEditor = require('./RouteEditor.jsx');
const SuiteActionCreators = require('../actions/SuiteActionCreators');
const mui = require('material-ui');
const _ = require('lodash');
const uuid = require('node-uuid');

let {RaisedButton, Toggle, TextField} = mui;

let SuiteEditor = React.createClass({
  getDefaultProps() {
    return {
      suite: null
    };
  },
  
  getInitialState() {
    return {
      suite: _.cloneDeep(this.props.suite)
    };
  },

  componentWillReceiveProps(nextProps){
    this.setState({suite: nextProps.suite});
  },

  _changeName(event){
    var newSuite = _.cloneDeep(this.state.suite);
    newSuite.name = event.target.value;
    this.setState({suite: newSuite});
  },

  _changeActive(event, toggled){
    var newSuite = _.cloneDeep(this.state.suite);
    newSuite.active = toggled;
    this.setState({suite: newSuite});
  },
  
  _addRoute(){
    var newSuite = _.cloneDeep(this.state.suite);
    var newRoute = {
      id:uuid.v4(),
      request: {
        method: 'GET',
        url: ''
      },
      response: {
        content:{
          text:''
        }
      }
    };
    newSuite.routes.push(newRoute);
    this.setState({suite: newSuite});
  },
  
  _changeRoute(newRoute){
    var newSuite = _.cloneDeep(this.state.suite);
    newSuite.routes.map((route, i) => {
      if(route.id === newRoute.id)
        newSuite.routes[i] = newRoute;
    });
    this.setState({suite: newSuite});
  },
  
  _deleteRoute(deletedRoute){
    var newSuite = _.cloneDeep(this.state.suite);
    newSuite.routes.map((route, i) => {
      if(route.id === deletedRoute.id)
        newSuite.routes.splice(i, 1);
    });
    this.setState({suite: newSuite});
  },
  
  _clickFileInput(){
    this.refs.harInput.getDOMNode().click();
  },
  
  _importHAR(event){
    console.log('Importing', event.target.files);
    let input = event.target;
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    } else if (!input) {
      alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
      alert("This browser doesn't seem to support the `files` property of file inputs.");
    } else if (!input.files[0]) {
      alert("Please select a file before clicking 'Load'");               
    } else {
      let file = input.files[0];
      let fr = new FileReader();
      fr.onload = this._parseHAR;
      fr.readAsText(file);
    }
  },
  
  _parseHAR(event){
    let parsedHAR = JSON.parse(event.target.result)
                      .log
                      .entries
                      .filter((route) => route.response.content.mimeType === "application/json");
                      
    parsedHAR.map((route) => {
      route.id = uuid.v4();
      
      // Make URL into relative
      route.request.url = '/' + route.request.url.split('/').splice(3).join('/');
      
      // Remove unneeded metadata to save space
      delete route.cache;
      delete route.connection;
      delete route.timings;
      delete route.startedDateTime;
      delete route.pageref;
      delete route.time;
    });
    console.log('Parsed Import', parsedHAR);
    
    var newSuite = _.cloneDeep(this.state.suite);
    newSuite.routes = newSuite.routes.concat(parsedHAR);
    console.log('newSuite', newSuite);
    this.setState({suite: newSuite});
  },
  
  _saveSuite(){
    SuiteActionCreators.updateSuite(this.state.suite);
  },

  _deleteSuite(){
    SuiteActionCreators.deleteSuite(this.props.suite);
  },

  _exportSuite(){
    console.log('Exporting');
    window.location.href = "data:text/json;charset=utf-8,";
  },
  
  render() {
    if(this.state.suite){
      let suiteExportURI = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(this.state.suite));
      let suiteExportFileName = this.state.suite.name.split(' ').join('') + '.flathead.json';
      return (
        <div className="suite-editor">
          <div className="suite-editor-buttons">
            <RaisedButton label="Save" onClick={this._saveSuite} />
            <RaisedButton label="Delete" onClick={this._deleteSuite} />
            <RaisedButton 
                label="Export" 
                linkButton={true}
                href={ suiteExportURI }
                download={ suiteExportFileName }/>
          </div>
          <div className="suite-metadata-editor">
            <TextField 
                floatingLabelText="Name" 
                fullWidth={true}
                value={this.state.suite.name} 
                onChange={this._changeName} />
            <Toggle 
                label="Active" 
                defaultToggled={this.state.suite.active} 
                onToggle={this._changeActive} />
          </div>
          <hr />
          <h3>Routes</h3>
          <div className="suite-editor-buttons">
            <RaisedButton label="Add Route" onClick={this._addRoute} />
            <RaisedButton label="Import HAR File" onClick={this._clickFileInput}>
            <input type="file" ref="harInput" style={{display:'none'}} onChange={this._importHAR} />
            </RaisedButton>
            
          </div>
            <ul className="route-list">
            { 
              this.state.suite.routes.map((route) => {
                return (
                  <li key={route.id}>
                    <RouteEditor 
                        route={route} 
                        onChange={this._changeRoute}
                        onDelete={this._deleteRoute}/>
                  </li>
                );
              }) 
            }
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
