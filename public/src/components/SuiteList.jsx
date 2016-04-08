const React = require('react');
const _ = require('lodash');
const SuiteActionCreators = require('../actions/SuiteActionCreators');
const mui = require('material-ui');
const packageJson = require('../../../package.json');

let {Toolbar, ToolbarGroup, ToolbarTitle, IconButton, FlatButton, Dialog} = mui;

let SuiteList = React.createClass({
  getDefaultProps: function(){
    return {
      suites:[]
    };
  },
  
  getInitialState() {
    return {
      helpPaneOpen: false
    };
  },
  
  _createNewSuite(){
    SuiteActionCreators.createNewSuite();
  },
  
  _clickImportInput(){
    this.refs.importInput.click();
  },
  
  _importNewSuite(event){
    let input = event.target;
    let files = [];
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
      fr.onload = this._parseImportedSuite;
      fr.readAsText(file);
    }
  },
  
  _parseImportedSuite(event){
    let parsedSuite = JSON.parse(event.target.result);
    
    // TODO: Validate the data better than this
    if(parsedSuite.id && parsedSuite.name && parsedSuite.routes){
      SuiteActionCreators.addSuite(parsedSuite);
    } else {
        alert('The JSON file does not validate as a Flathead JSON file.');
    }
    
  },
  
  _selectSuite(suite){
    this.props.selectSuite(suite);
  },
  
  _toggleSuiteActive(suite, active, event){
    event.stopPropagation();
    
    var newSuite = _.cloneDeep(suite);
    newSuite.active = active;
    SuiteActionCreators.updateSuite(newSuite);
  },
  
  _openHelpPane() {
    this.setState({helpPaneOpen: true});
  },

  _closeHelpPane() {
    this.setState({helpPaneOpen: false});
  },

  render() {
    console.log('Rendering...', this.props.suites);
    const actions = [
      <FlatButton
        key={5467209}
        label="Close"
        onTouchTap={this._closeHelpPane}
      />
    ];
    return (
      <div className="suite-list-pane">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="API Suites" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <IconButton 
                iconClassName="material-icons mui-icon-help" 
                tooltip="Help"
                onClick={this._openHelpPane}/>
            <Dialog
              title="About Flathead"
              actions={actions}
              open={this.state.helpPaneOpen}
              onRequestClose={this._closeHelpPane}
            >
              <strong>Version: { packageJson.version }</strong>
              <p>Flathead is an MIT Licensed utility for mocking APIs. You can find the source on <a href="https://github.com/chrisuehlinger/Flathead">GitHub</a> and install it with <a href="https://www.npmjs.com/package/flathead">npm</a>.</p>
            </Dialog>
            <IconButton 
                iconClassName="material-icons mui-icon-add-item" 
                tooltip="Add Suite"
                onClick={this._createNewSuite}/>
            <IconButton 
                iconClassName="material-icons mui-icon-upload" 
                tooltip="Import Suite" 
                onClick={this._clickImportInput}/>
            <input type="file" ref="importInput" style={{display:'none'}} onChange={this._importNewSuite} accept=".json" />
          </ToolbarGroup>
        </Toolbar>
        <ul className="suite-list">
        { 
          this.props.suites.map((suite) => { 
            return (
              <li key={suite.id}>
              <a href="javascript:void(0);" onClick={this._selectSuite.bind(this, suite) }>
                  {suite.name}
                  { suite.active 
                  ? <span className="suite-active-indicator" onClick={this._toggleSuiteActive.bind(this, suite, false)}></span>
                      : <span className="suite-inactive-indicator" onClick={this._toggleSuiteActive.bind(this, suite, true)}></span> }
                </a>
              </li>
            );
          }) 
        }
        </ul>
      </div>
    );
  }
});

module.exports = SuiteList;
