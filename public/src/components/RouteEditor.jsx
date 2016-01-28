const React = require('react');
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/display/fullscreen.js');
const mui = require('material-ui');
const _ = require('lodash');

let {
  RaisedButton, 
  Checkbox, 
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
    this.setState({ route: newRoute });
  },
  
  _changeMethod(event) {
    var newRoute = _.cloneDeep(this.state.route);
    newRoute.request.method = event.target.value;
    this.setState({ route: newRoute });
  },
  
  _changeMirror(event, toggled) {
    var newRoute = _.cloneDeep(this.state.route);
    newRoute.response.mirrorRequest = toggled;
    this.setState({ route: newRoute });
    this.props.onChange(newRoute);
  },
  
  _changeResponseText(newResponseText) {
    //console.log('New Response text', newResponseText);
    if(newResponseText !== this.state.route.response.content.text){
        var newRoute = _.cloneDeep(this.state.route);
        newRoute.response.content.text = newResponseText;
        this.setState({ route: newRoute });
    }
  },
  
  _reportChange() {
      console.log('Reporting change to:', this.state.route);
    this.props.onChange(this.state.route);
  },
  
  _deleteRoute() {
    this.props.onDelete(this.state.route);
  },

  render() {
    let responseText = this.state.route.response.content.text;
    
    let options = {
      lineNumbers: true,
      mode:{name:"javascript", json:true},
      theme: 'monokai',
      lineWrapping: true,
      extraKeys: {
        "F11": function(cm) {
          console.log('FULLSCREEN', cm.getOption("fullScreen"));
          cm.setOption("fullScreen", !cm.getOption("fullScreen"));
        },
        "Esc": function(cm) {
          if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false);
        }
      }
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
        {this.state.route.request.method === 'GET' 
            && <RaisedButton
                    label="Test"
                    linkButton={true}
                    target="_blank"
                    href={this.state.route.request.url}/>}
        <TextField 
            floatingLabelText="URL" 
            ref="urlInput" 
            value={this.state.route.request.url}
            fullWidth={true}
            onChange={this._changeURL}
            onBlur={this._reportChange}/>
        <div>
        Response:
        <Checkbox 
            label="Mirror Request Body" 
            disabled= {this.state.route.request.method === 'GET'}
            defaultChecked={this.state.route.response.mirrorRequest} 
            onCheck={this._changeMirror} />
        { !this.state.route.response.mirrorRequest &&
          <CodeMirror 
              value={responseText} 
              options={options} 
              onChange={this._changeResponseText}
              onFocusChange={this._reportChange} /> }
        </div>
      </Paper>
    );
  }
});

module.exports = RouteEditor;
