const React = require('react');
const mui = require('material-ui');

let {Toggle} = mui;

let SuiteList = React.createClass({
  getDefaultProps: function(){
    return {
      suites:[]
    };
  },

  componentDidMount() {
  },
  
  _selectSuite(suite){
    this.props.selectSuite(suite);
  },

  render() {
    console.log(this.props.suites);
    return (
      <div className="suite-list-pane">
      <div className="suite-list-header">API Suites</div>
        <ul className="suite-list">
        { 
          this.props.suites.map((suite) => { 
            return (
              <li key={suite.id}>
              <a href="javascript:void(0);" onClick={this._selectSuite.bind(this, suite) }>
                  {suite.name}
                  <span className="suite-active-indicator">
                    <Toggle />
                  </span>
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
