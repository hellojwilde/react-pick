var React = require('react');

var emptyFunction = require('./helpers/emptyFunction');
var getStringForElements = require('./helpers/getStringForElements');

var TypeaheadInput = React.createClass({

  propTypes: {
    autocompletion: React.PropTypes.any,
    getLabelForOption: React.PropTypes.func,
    getLabelSelectionRange: React.PropTypes.func,
    inputValue: React.PropTypes.string,
    onRequestChange: React.PropTypes.func,
    onRequestSelect: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      getLabelSelectionRange: function(inputValue, label) {
        inputValue = inputValue.toLowerCase();
        label = label.toLowerCase();

        if (inputValue === '' || inputValue === label) {
          return null;
        } else if (label.indexOf(inputValue) === -1) {
          return null;
        } else {
          return {start: inputValue.length, end: label.length};
        }
      },
      getLabelForOption: getStringForElements,
      inputValue: '',
      onRequestChange: emptyFunction,
      onRequestSelect: emptyFunction
    };
  },

  getInitialState: function() {
    return {
      isTypingForward: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var inputLength = this.props.inputValue.length;
    var nextInputLength = nextProps.inputValue.length;

    if (inputLength !== nextInputLength) {
      this.setState({isTypingForward: nextInputLength > inputLength});
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    // We only want to autocomplete when we have an option to complete in the 
    // textbox, and when the user is actively typing content into the textbox.
    // Typing ahead when deleting text feels annoying.

    if (this.props.autocompletion == null || !this.state.isTypingForward) {
      return;
    }

    // Provided that we have an autocomplete option, and we're not currently
    // trying getting rid of text from the box, inset a possible autocompletion
    // result and highlight the part that was inserted.

    var input = this.refs['input'].getDOMNode();
    var {inputValue, autocompletion} = this.props;
    var label = this.props.getLabelForOption(autocompletion);
    var range = this.props.getLabelSelectionRange(inputValue, label);

    if (range) {
      input.value = label;
      input.setSelectionRange(range.start, range.end);
    }
  },

  select: function() {
    var {autocompletion, onRequestSelect} = this.props;
    autocompletion && onRequestSelect(autocompletion);
  },

  handleChange: function(event) {
    this.props.onRequestChange(event.target.value);
  },

  handleBlur: function() {
    this.select();
  },

  render: function() {
    var {inputValue, ...otherProps} = this.props;

    return (
      <input
        ref="input"
        value={inputValue}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        {...otherProps}
      />
    );
  }

});

module.exports = TypeaheadInput;