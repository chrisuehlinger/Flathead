const React = require('react');
const RouteEditor = require('./RouteEditor.jsx');

let SuiteEditor = React.createClass({
  getInitialProps() {
    return {
      suite: null
    };
  },

  componentDidMount() {
  },

  render() {
    if(this.props.suite){
      return (
        <div className="suite-editor">
        <div>Name: {this.props.suite.name}</div>
          Routes:
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
