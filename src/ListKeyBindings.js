var React = require('react/addons');

var {cloneWithProps} = React.addons;
var emptyFunction = require('./helpers/emptyFunction');

const KEY_DOWN = 40;
const KEY_UP = 38;
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

  propTypes: {
    focusedIndex: React.PropTypes.number,
    optionsLength: React.PropTypes.number,
    onChange: React.PropTypes.func.isRequired,
    onComplete: React.PropTypes.func.isRequired,
    onCancel: React.PropTypes.func.isRequired
  },

  getDefaultProps: function() {
    return {
      focusedIndex: null,
      optionsLength: 0
    };
  },

  getKeyBindings: function() {
    return {
      [KEY_DOWN]: this.changeNext,
      [KEY_UP]: this.changePrevious,
      [KEY_RETURN]: () => this.props.onComplete(this.props.focusedIndex),
      [KEY_ESC]: this.props.onCancel
    };
  },

  changeNext: function() {
    var {focusedIndex, optionsLength, onChange} = this.props;

    optionsLength && onChange(
      (focusedIndex === null) 
        ? 0 
        : Math.min(focusedIndex + 1, optionsLength - 1)
    );
  },

  changePrevious: function() {
    var {focusedIndex, optionsLength, onChange} = this.props;

    optionsLength && this.props.onChange(
      (focusedIndex === null) 
        ? optionsLength - 1
        : Math.max(0, focusedIndex - 1)
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