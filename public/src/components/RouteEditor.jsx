const React = require('react');
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript.js');
const mui = require('material-ui');
const _ = require('lodash');

let {RaisedButton, Toggle, TextField, Paper, IconButton} = mui;

let RouteEditor = React.createClass({
  getDefaultProps(){
    return { 
      route: null, 
      onChange: function(){},
      onDelete: function(){}
    };
  },

  getInitialState(){
    return { 
      route: this.props.route 
    };
  },
  
  componentWillReceiveProps(nextProps) {
    this.setState({ route: nextProps.route });
  },
  
  _changeURL(event) {
    var newRoute = _.cloneDeep(this.state.route);
    newRoute.request.url = event.target.value;
    this.props.onChange(newRoute);
  },
  
  _changeResponseText(newResponseText) {
    var newRoute = _.cloneDeep(this.state.route);
    newRoute.response.content.text = newResponseText;
    this.props.onChange(newRoute);
  },
  
  _deleteRoute() {
    this.props.onDelete(this.state.route);
  },

  render() {
    let responseText;
    try {
      responseText = JSON.stringify(JSON.parse(this.state.route.response.content.text), null, 2);
    } catch(error){
      responseText = this.state.route.response.content.text;
    }
    
    let options = {
			lineNumbers: true,
            mode:{name:"javascript", json:true},
            theme: 'monokai',
            lineWrapping: true
		};
    return (
      <Paper zDepth={2} className="route-editor">
        <div className="delete-button-area">
          <IconButton 
                iconClassName="material-icons mui-icon-clear-item" 
                tooltip="Delete"
                onClick={this._deleteRoute}/>
        </div>
        <TextField 
            floatingLabelText="URL" 
            ref="urlInput" 
            value={this.state.route.request.url}
            fullWidth={true}
            onChange={this._changeURL}/>
        <div>
        Response: 
        <CodeMirror value={responseText} options={options} onChange={this._changeResponseText}/>
        </div>
      </Paper>
    );
  }
});

module.exports = RouteEditor;