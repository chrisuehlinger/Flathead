const React = require('react');

let SuiteList = React.createClass({
  getDefaultProps: function(){
    return {
      suites:[]
    };
  },

  componentDidMount() {
  },

  render() {
    return (
      <ul className="suite-list">
        { this.props.suites.map((suite) => <li>{suite}</li>) }
      </ul>
    );
  }
});

module.exports = SuiteList;
