const React = require('react');

let RouteEditor = React.createClass({
  componentDidMount() {
  },

  render() {
    return (
      <div className="route-editor">
        <div>
          URL: {this.props.route.request.url}
        </div>
        <div>
        Response: {this.props.route.response.content.text}
        </div>
      </div>
    );
  }
});

module.exports = RouteEditor;
