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
                tooltip="Import Suite"/>
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
