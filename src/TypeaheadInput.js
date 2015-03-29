var React = require('react');

var emptyFunction = require('./helpers/emptyFunction');
var getLabelForOption = require('./defaults/getLabelForOption');
var getLabelSelectionRange = require('./defaults/getLabelSelectionRange');

var TypeaheadInput = React.createClass({

  propTypes: {
    getLabelForOption: React.PropTypes.func,
    getLabelSelectionRange: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onSelect: React.PropTypes.func,
    option: React.PropTypes.any,
    value: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      getLabelForOption: getLabelForOption,
      getLabelSelectionRange: getLabelSelectionRange,
      onChange: emptyFunction,
      onSelect: emptyFunction,
      option: null,
      value: ''
    };
  },

  getInitialState: function() {
    return {
      isTypingForward: false
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var inputLength = this.props.value.length;
    var nextInputLength = nextProps.value.length;

    if (inputLength !== nextInputLength) {
      this.setState({isTypingForward: nextInputLength > inputLength});
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    // We only want to autocomplete when we have an option to complete in the 
    // textbox, and when the user is actively typing content into the textbox.
    // Typing ahead when deleting text feels annoying.

    if (this.props.option == null || !this.state.isTypingForward) {
      return;
    }

    // Provided that we have an autocomplete option, and we're not currently
    // trying getting rid of text from the box, inset a possible option
    // result and highlight the part that was inserted.

    var input = this.refs['input'].getDOMNode();
    var {value, option} = this.props;
    var label = this.props.getLabelForOption(option);
    var range = this.props.getLabelSelectionRange(value, label);

    if (range) {
      input.value = label;
      input.setSelectionRange(range.start, range.end);
    }
  },

  select: function() {
    this.props.option && this.props.onSelect(this.props.option);
  },

  handleChange: function(event) {
    this.props.onChange(event.target.value);
  },

  handleBlur: function() {
    this.select();
  },

  render: function() {
    var {onChange, onSelect, ...otherProps} = this.props;

    return (
      <input
        {...otherProps}
        ref="input"
        onChange={this.handleChange}
        onBlur={this.handleBlur}
      />
    );
  }

});

module.exports = TypeaheadInput;