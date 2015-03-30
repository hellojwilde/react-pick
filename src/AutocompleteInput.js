var React = require('react');

var emptyFunction = require('./helpers/emptyFunction');

const KEY_RETURN = 13;
const KEY_TAB = 9;
const KEY_BACKSPACE = 8;

function getTypeaheadSelectRange(value, completionValue) {
  value = (value || '').toLowerCase();
  completionValue = (completionValue || '').toLowerCase();

  if (value === '' || value === completionValue) {
    return null;
  } else if (completionValue.indexOf(value) !== 0) {
    return null;
  } else {
    return {start: value.length, end: completionValue.length};
  }
}

var AutocompleteInput = React.createClass({

  propTypes: {
    completionValue: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    value: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      completionValue: null,
      onChange: emptyFunction,
      onComplete: emptyFunction,
      value: null
    };
  },

  getInitialState: function() {
    return {
      isTypingForward: false
    };
  },

  updateCompletionTypeahead: function() {
    // We only want to autocomplete when we have an option to complete in the 
    // textbox, and when the user is actively typing content into the textbox.
    // Typing ahead when deleting text feels annoying.
  
    if (this.props.completionValue === null || 
        this.isTypingForward !== true) {
      return;
    }

    // Insert a possible option result and highlight the part that was inserted.

    var input = this.refs['input'].getDOMNode();
    var {value, completionValue} = this.props;
    var range = getTypeaheadSelectRange(value, completionValue);

    if (range !== null) {
      input.value = value + completionValue.slice(range.start, range.end);
      input.setSelectionRange(range.start, range.end);
    }
  },

  isCompletionPossible: function() {
    var {value, completionValue} = this.props;
    return getTypeaheadSelectRange(value, completionValue) !== null;
  },

  complete: function() {
    if (!this.isCompletionPossible()) {
      return;
    }

    var {completionValue} = this.props;
    var end = completionValue.length;
    this.refs['input'].getDOMNode().setSelectionRange(end, end);

    this.props.onChange(completionValue);
    this.props.onComplete(completionValue);
  },

  handleBlur: function(event) {
    this.complete();
  },

  handleChange: function(event) {
    this.props.onChange(event.target.value);
  },

  handleKeyDown: function(event) {
    var isCompletionKey = (
      event.keyCode === KEY_RETURN || 
      event.keyCode === KEY_TAB
    );

    if (isCompletionKey && this.isCompletionPossible()) {
      event.preventDefault();
      this.complete();
    }

    this.isTypingForward = event.keyCode !== KEY_BACKSPACE;
  },

  handleKeyUp: function(event) {
    this.updateCompletionTypeahead();
  },

  render: function() {
    var {onChange, ...otherProps} = this.props;

    return (
      <input
        {...otherProps}
        ref="input"
        onBlur={this.handleBlur}
        onChange={this.handleChange}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
      />
    );
  }

});

module.exports = AutocompleteInput;
