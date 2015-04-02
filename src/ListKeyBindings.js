var React = require('react/addons');

var {cloneWithProps, PureRenderMixin} = React.addons;

var emptyFunction = require('./helpers/emptyFunction');

const KEY_ARROW_DOWN = 40;
const KEY_ARROW_UP = 38;
const KEY_RETURN = 13;
const KEY_ESC = 27;

/**
 * <ListKeyBindings> represents the types of key behavior that should be used
 * to navigate between the different sequential items in <ListPopup>.
 *
 * This is a separate wrapper component because we also want to apply these
 * same sorts of key bindings to the <input> in the <Combobox> widget.
 */
var ListKeyBindings = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    optionIndex: React.PropTypes.number,
    optionsLength: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired,
    onComplete: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      optionIndex: null,
      optionsLength: 0
    };
  },

  getKeyBindings: function() {
    return {
      [KEY_ARROW_DOWN]: this.changeNext,
      [KEY_ARROW_UP]: this.changePrevious,
      [KEY_RETURN]: this.complete,
      [KEY_ESC]: this.props.onCancel
    };
  },

  isCompletionPossible: function() {
    return this.props.optionsLength > 0;
  },

  complete: function() {
    var {optionIndex, onComplete} = this.props;
    this.isCompletionPossible() && onComplete(optionIndex)
  },

  changeNext: function() {
    var {optionIndex, optionsLength, onChange} = this.props;

    this.isCompletionPossible() && onChange(
      (optionIndex === null) 
        ? 0 
        : Math.min(optionIndex + 1, optionsLength - 1)
    );
  },

  changePrevious: function() {
    var {optionIndex, optionsLength, onChange} = this.props;

    this.isCompletionPossible() && this.props.onChange(
      (optionIndex === null) 
        ? optionsLength - 1
        : Math.max(0, optionIndex - 1)
    );
  },

  handleKeyDown: function(event) {
    var bindings = this.getKeyBindings();
    var binding = bindings[event.keyCode];

    if (binding) {
      event.preventDefault();
      binding();
    }
  },

  render: function() {
    return cloneWithProps(React.Children.only(this.props.children), {
      onKeyDown: this.handleKeyDown
    });
  }

});

module.exports = ListKeyBindings;