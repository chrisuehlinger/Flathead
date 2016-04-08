const React = require('react');
const CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript.js');
require('codemirror/addon/display/fullscreen.js');
const mui = require('material-ui');
const _ = require('lodash');
const jsonlint = require("jsonlint");
const $ = require('jquery');


let {
  RaisedButton,
  Checkbox,
  TextField,
  Paper,
  IconButton,
  DropDownMenu
} = mui;


let RouteEditor = React.createClass({

  getDefaultProps() {
    return {
      route: null,
      active: false,
      onChange: function() { },
      onCopy: function() { },
      onDelete: function() { }
    };
  },

  getInitialState() {
    return {
      route: this.props.route,
      active: this.props.active,
      collapsed: true,
      errorLines: []
    };
  },

  componentWillReceiveProps(nextProps) {
    this.setState({ route: nextProps.route, active: nextProps.active });
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
    if (newResponseText !== this.state.route.response.content.text) {
      var newRoute = _.cloneDeep(this.state.route);
      newRoute.response.content.text = newResponseText;

      //CEW - 04-05-2016 Use jsonlint and json parse to test if json is valid.
      //Jsonlint only returns one line error at a time, so we reset the highlight on all 
      //lines before doing any tests on the input.
      //I also don’t want to prevent any saving of the text, just in case 
      //a user intentially wants the json to be bad.
      this.removeAllErrorHighlights();
      let ret = this._validateResponseText(newResponseText);
      this.setState({ route: newRoute });
    }
  },

  _collapseRoute() {
    this.setState({ collapsed: true });
  },

  _expandRoute() {
    this.setState({ collapsed: false });
  },

  _reportChange() {
    console.log('Reporting change to:', this.state.route);
    this.props.onChange(this.state.route);
  },

  _deleteRoute() {
    this.props.onDelete(this.state.route);
  },

  _validateResponseText(jsonString) {

    try {
      JSON.parse(jsonString);
      return {
        valid: true,
        error: ''
      };
    }
    catch (ex) {
      try {
        jsonlint.parse(jsonString);
        return {
          valid: true,
          error: ''
        };
      } catch (ex) {

        // retrieve line number from error
        let lineMatch = ex.message.match(/line ([0-9]*)/);
        if (lineMatch && lineMatch.length > 1) {
          //Highlight error line.
          this.highlightErrorLine(+lineMatch[1] - 1);
        }
        return {
          valid: false,
          error: ex.message.toString()
        };
      }

    } finally {
      //Do nothing
    }
  },

  //#region Methods to highlight text

  //Highlights given line of code.  
  //If "remove", remove specified highlight 
  //from code line.
  highlightErrorLine(lineNumber, remove = false) {
    let editor = this.refs.CodeMirror;
    if (editor) {
      let codeMirrorInstance = editor.getCodeMirror();
      if (codeMirrorInstance) {
        if (remove) {
          codeMirrorInstance.removeLineClass(lineNumber, 'wrap', 'line-error');
        }
        else {
          codeMirrorInstance.addLineClass(lineNumber, 'wrap', 'line-error');
        }
      }
    }
  },
  //Remove error highlight from all lines.
  removeAllErrorHighlights() {
    let editor = this.refs.CodeMirror;
    if (editor) {
      let codeMirrorInstance = editor.getCodeMirror();
      if (codeMirrorInstance) {
        for (let i = 0; i < codeMirrorInstance.lineCount(); i++) {
          codeMirrorInstance.removeLineClass(i, 'wrap', 'line-error');
        }
      }
    }
  },

  //#endregion

  render() {
    let responseText = this.state.route.response.content.text;

    let options = {
      lineNumbers: true,
      mode: { name: "javascript", json: true },
      theme: 'monokai',
      lineWrapping: true,

      extraKeys: {
        "F11": function(cm) {
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

    var buttonStyle = {
      verticalAlign: 'middle',
      margin: 10
    };

    var iconButtonStyle = {
      padding: 0,
      width: 24,
      verticalAlign: 'middle'
    }

    return (
      <Paper zDepth= { 2} className= { "route-editor" + (this.state.collapsed ? ' collapsed-route-editor' : '') } >
        <div className="delete-button-area">
          <IconButton
            iconClassName="material-icons mui-icon-clear-item"
            tooltip="Delete"
            onClick={this._deleteRoute}/>
        </div>
        <div className="collapse-area">
          { this.state.collapsed
            ? <div>
              <IconButton
                iconClassName="material-icons mui-icon-add-item"
                tooltip="Expand"
                onClick={this._expandRoute}
                style={iconButtonStyle}/>
              <span style={ { fontWeight: 'bold', margin: 5 } }>{ this.state.route.request.method }</span>
              { (this.state.route.request.method === 'GET' && this.state.active)
                ? <a target="_blank" href={this.state.route.request.url}>{this.state.route.request.url}</a>
                : <span style={ { fontStyle: 'italic' } }>{ this.state.route.request.url }</span>
              }
            </div>
            : <IconButton
              iconClassName="material-icons mui-icon-remove"
              tooltip="Collapse"
              onClick={this._collapseRoute}
              style={iconButtonStyle}/>
          }
        </div>
        { !this.state.collapsed &&
          <div>
            <TextField
              floatingLabelText="Method"
              value={this.state.route.request.method}
              onChange={this._changeMethod}
              onBlur={this._reportChange} />
            { (this.state.route.request.method === 'GET' && this.state.active)
              && <RaisedButton
                label="Test"
                linkButton={true}
                target="_blank"
                href={this.state.route.request.url}
                style={buttonStyle} />}
            <RaisedButton
              label="Copy"
              onClick={ this.props.onCopy }
              style={buttonStyle} />
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
                  ref="CodeMirror"
                  value = { responseText }
                  options = { options }
                  onChange = { this._changeResponseText }
                  onFocusChange = { (focused) => !focused && this._reportChange() } /> }
            </div>
          </div>
        }
      </Paper >
    );
  }
});

module.exports = RouteEditor;