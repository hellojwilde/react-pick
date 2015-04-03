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
 */
var ListKeyBindings = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    /**
     * Event handler for when the user requests for the <ListPopup> to focus on
     * a different index. Function receives the `index` of the option to focus.
     */
    onChange: React.PropTypes.func.isRequired,

    /**
     * Event handler for when the user requests for the <ListPopup> to fill in
     * the parent <Combobox> widget. Function receives the `index` of the
     * option to focus.
     */
    onComplete: React.PropTypes.func.isRequired,

    /**
     * Event handler for when the user requests to cancel the autocompletion 
     * process and hide the <ListPopup>.
     */
    onCancel: React.PropTypes.func.isRequired,

    /**
     * The currently focused index of the affiliated <ListPopup>.
     */
    optionIndex: React.PropTypes.number,

    /**
     * The number of options in the affiliated <ListPopup>.
     */
    optionsLength: React.PropTypes.number
  },

  getDefaultProps: function() {
    return {
      optionIndex: null,
      optionsLength: 0
    };
  },

  getKeyBindings: function() {
    return {
      [KEY_ARROW_DOWN]: this.changeToNext,
      [KEY_ARROW_UP]: this.changeToPrevious,
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

  changeToNext: function() {
    var {optionIndex, optionsLength, onChange} = this.props;

    this.isCompletionPossible() && onChange(
      (optionIndex === null) 
        ? 0 
        : Math.min(optionIndex + 1, optionsLength - 1)
    );
  },

  changeToPrevious: function() {
    var {optionIndex, optionsLength, onChange} = this.props;

    this.isCompletionPossible() && this.props.onChange(
      (optionIndex === null) 
        ? optionsLength - 1
        : Math.max(0, optionIndex - 1)
    );
  },

  handleKeyDown: function(event) {
    var binding = this.getKeyBindings()[event.keyCode];
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