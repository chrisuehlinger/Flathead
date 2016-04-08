const React = require('react');
const RouteEditor = require('./RouteEditor.jsx');
const RouteActionCreators = require('../actions/RouteActionCreators');
const SuiteActionCreators = require('../actions/SuiteActionCreators');
const mui = require('material-ui');
const _ = require('lodash');
const uuid = require('node-uuid');

let {RaisedButton, Toggle, TextField} = mui;
var Isvg = require('react-inlinesvg');

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
    SuiteActionCreators.updateSuite(newSuite);
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
    RouteActionCreators.addRoute(this.state.suite.id, newRoute);
  },
  
  _changeRoute(newRoute){
    RouteActionCreators.updateRoute(this.state.suite.id, newRoute);
  },
  
  _copyRoute(routeToCopy, routeIndex){
    var newRoute = _.cloneDeep(routeToCopy);
    newRoute.id = uuid.v4();
    
    RouteActionCreators.addRoute(this.state.suite.id, newRoute, true);
  },
  
  _removeDuplicateRoutes(){
    var newSuite = _.cloneDeep(this.state.suite);
    var i,j;
    for(i = 0; i < newSuite.routes.length; i++){
      var routeI = newSuite.routes[i];
      for(j=i+1; j < newSuite.routes.length; j){
        var routeJ = newSuite.routes[j];
        if(routeI.request.method === routeJ.request.method && routeI.request.url === routeJ.request.url){
          newSuite.routes.splice(j,1);
        } else
          j++;
      }
    }
    SuiteActionCreators.updateSuite(newSuite);
  },
  
  _flattenJSON(){
    var newSuite = _.cloneDeep(this.state.suite);
    newSuite.routes.map((route, i) => {
      try {
        route.response.content.text = JSON.stringify(JSON.parse(route.response.content.text));
      } catch (error) {
        // I guess it wasn't valid JSON
      }
    });
    SuiteActionCreators.updateSuite(newSuite);
  },
  
  _prettyPrintJSON(){
    var newSuite = _.cloneDeep(this.state.suite);
    newSuite.routes.map((route, i) => {
      try {
        route.response.content.text = JSON.stringify(JSON.parse(route.response.content.text), null, 2);
      } catch (error) {
        // I guess it wasn't valid JSON
      }
    });
    SuiteActionCreators.updateSuite(newSuite);
  },
  
  _deleteRoute(deletedRoute){
    RouteActionCreators.deleteRoute(this.state.suite.id, deletedRoute);
  },
  
  _clickFileInput(){
    this.refs.harInput.click();
  },
  
  _importHAR(event){
    let input = event.target;
    let files;
    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
      alert('The File APIs are not fully supported in this browser.');
      return;
    } else if (!input) {
      alert("Um, couldn't find the fileinput element.");
    } else if (!input.files) {
        if(input instanceof Array){
          files = input;
        } else {
          console.log(input);
          alert("This browser doesn't seem to support the `files` property of file inputs.");
        }
    } else {
      files = input.files;
    }
    
    if(!files){
      console.log('Looks like theres a problem');
    } else if (!files[0]) {
      alert("Please select a file before clicking 'Load'");               
    } else {
      let file = files[0];
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
    SuiteActionCreators.updateSuite(newSuite);
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
                onChange={this._changeName} 
                onBlur={this._saveSuite} />
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
            <input type="file" ref="harInput" style={{display:'none'}} onChange={this._importHAR} accept=".har" />
            </RaisedButton>
            <RaisedButton label="Remove Duplicates" onClick={this._removeDuplicateRoutes} />
            <RaisedButton label="Pretty Print JSON" onClick={this._prettyPrintJSON} />
            <RaisedButton label="Minify JSON" onClick={this._flattenJSON} />
          </div>
            <ul className="route-list">
            { 
              this.state.suite.routes.map((route, i) => {
                return (
                  <li key={route.id}>
                    <RouteEditor 
                        route={route}
                        active={this.state.suite.active}
                        onChange={this._changeRoute}
                        onDelete={this._deleteRoute}
                        onCopy={this._copyRoute.bind(this,route,i)}/>
                  </li>
                );
              }) 
            }
            </ul>
        </div>
      );
    } else {
      return (
        <div className="suite-editor suite-editor-empty">
          <Isvg src="/img/logo.svg" />
          <h1>FLATHEAD</h1>
        </div>
      );
    }
  }
});

module.exports = SuiteEditor;
