const React = require('react');

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
          Name: {this.props.suite.name}
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
