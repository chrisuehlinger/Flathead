const React = require('react');
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript.js');
const mui = require('material-ui');

let {RaisedButton, Toggle, TextField} = mui;

let RouteEditor = React.createClass({
  componentDidMount() {
  },

  render() {
    let responseText = JSON.stringify(JSON.parse(this.props.route.response.content.text), null, 2);
    let options = {
			lineNumbers: true,
            mode:{name:"javascript", json:true},
            theme: 'monokai',
            lineWrapping: true
		};
    return (
      <div className="route-editor">
        <TextField 
            floatingLabelText="URL" 
            ref="urlInput" 
            defaultValue={this.props.route.request.url}
            fullWidth={true}/>
        <div>
        Response: 
        <CodeMirror value={responseText} options={options}/>
        </div>
      </div>
    );
  }
});

module.exports = RouteEditor;
