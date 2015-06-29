const React = require('react');
const mui = require('material-ui');
const SuiteActionCreators = require('../actions/SuiteActionCreators');

let {Toolbar, ToolbarGroup, ToolbarTitle, IconButton} = mui;

let SuiteList = React.createClass({
  getDefaultProps: function(){
    return {
      suites:[]
    };
  },
  
  _createNewSuite(){
    SuiteActionCreators.createNewSuite();
  },
  
  _clickImportInput(){
    this.refs.importInput.getDOMNode().click();
  },
  
  _importNewSuite(){
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
      fr.onload = this._parseImportedSuite;
      fr.readAsText(file);
    }
  },
  
  _parseImportedSuite(event){
    let parsedSuite = JSON.parse(event.target.result);
    
    // TODO: Validate the data better than this
    if(parsedSuite.id && parsedSuite.name && parsedSuite.routes){
      SuiteActionCreators.addSuite(parsedSuite);
    }
    
  },
  
  _selectSuite(suite){
    this.props.selectSuite(suite);
  },

  render() {
    console.log(this.props.suites);
    return (
      <div className="suite-list-pane">
        <Toolbar>
          <ToolbarGroup key={0} float="left">
            <ToolbarTitle text="API Suites" />
          </ToolbarGroup>
          <ToolbarGroup key={1} float="right">
            <IconButton 
                iconClassName="material-icons mui-icon-add-item" 
                tooltip="Add Suite"
                onClick={this._createNewSuite}/>
            <IconButton 
                iconClassName="material-icons mui-icon-upload" 
                tooltip="Import Suite" 
                onClick={this._clickImportInput}/>
            <input type="file" ref="importInput" style={{display:'none'}} onChange={this._importNewSuite}/>
          </ToolbarGroup>
        </Toolbar>
        <ul className="suite-list">
        { 
          this.props.suites.map((suite) => { 
            return (
              <li key={suite.id}>
              <a href="javascript:void(0);" onClick={this._selectSuite.bind(this, suite) }>
                  {suite.name}
                  { suite.active && <span className="suite-active-indicator"></span> }
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
