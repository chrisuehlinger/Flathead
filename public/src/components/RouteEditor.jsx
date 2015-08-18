const React = require('react');
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript.js');
const mui = require('material-ui');
const _ = require('lodash');

let {
  RaisedButton, 
  Toggle, 
  TextField, 
  Paper, 
  IconButton,
  DropDownMenu
  } = mui;

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
    this.setState({route: newRoute});
  },
  
  _changeMethod(event) {
    var newRoute = _.cloneDeep(this.state.route);
    newRoute.request.method = event.target.value;
    this.setState({route: newRoute});
  },
  
  _changeResponseText(newResponseText) {
    var newRoute = _.cloneDeep(this.state.route);
    newRoute.response.content.text = newResponseText;
    this.setState({route: newRoute});
  },
  
  _reportChange() {
    this.props.onChange(this.state.route);
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
        
    var methods = [
      { payload: '1', text: 'GET' },
      { payload: '2', text: 'POST' },
      { payload: '3', text: 'PUT' },
      { payload: '4', text: 'DELETE' }
    ];
    return (
      <Paper zDepth={2} className="route-editor">
        <div className="delete-button-area">
          <IconButton 
                iconClassName="material-icons mui-icon-clear-item" 
                tooltip="Delete"
                onClick={this._deleteRoute}/>
        </div>
        <TextField 
            floatingLabelText="Method" 
            value={this.state.route.request.method}
            onChange={this._changeMethod}
            onBlur={this._reportChange} />
        <TextField 
            floatingLabelText="URL" 
            ref="urlInput" 
            value={this.state.route.request.url}
            fullWidth={true}
            onChange={this._changeURL}
            onBlur={this._reportChange} />
        <div>
        Response: 
        <CodeMirror 
            value={responseText} 
            options={options} 
            onChange={this._changeResponseText}
            onBlur={this._reportChange} />
        </div>
      </Paper>
    );
  }
});

module.exports = RouteEditor;
