var React = require('react');

var emptyFunction = require('./helpers/emptyFunction');

const KEY_RETURN = 13;
const KEY_TAB = 9;
const KEY_BACKSPACE = 8;

/**
 * Given:
 *  - `value`, the text the user typed into the textbox, and 
 *  - `completionValue`, the value that should be typed ahead;
 *   
 * Returns an object with the keys:
 *  - `valueWithCompletion`, the value with typeahead to appear in the input,
 *  - `start`, the start index of the text that was typed ahead, and
 *  - `end`, the end index of the text that was typed ahead;
 *
 * Returns `null` in the event that there is no string match between `value`  
 * and `completionValue`--indicating that there are erroneous arguments passed.
 */
function getCompletionTypeahead(value, completionValue) {
  value = (value || '').toLowerCase();
  completionValue = (completionValue || '').toLowerCase();

  if (value === '' || value === completionValue) {
    return null;
  } else if (completionValue.indexOf(value) !== 0) {
    return null;
  } else {
    var start = value.length;
    var end = completionValue.length;
    var valueWithCompletion = value + completionValue.slice(start, end);

    return {valueWithCompletion, start, end};
  }
}

/**
 * <AutocompleteInput> are a lightweight wrapper around <input>, enabling
 * a UI to show text "typed ahead" of the user's current input. This is useful
 * for displaying a prediction about what the user is going to type next.
 *
 * To use the component, you just supply two additional properties over what
 * you normally would for an <input> element:
 *
 *  - `completionValue`, the full predicted string to type into the textbox.
 *    For example, if you were trying to autocomplete dates, and the user typed 
 *    "Calif", you might supply "California" for this.
 *  - `onComplete`, an event handler for when the user tabs or otherwise does
 *    an action to complete the text in the component.
 *
 * This component attempts to conform to WAI-ARIA's autocomplete requirements:
 * <http://www.w3.org/TR/wai-aria/states_and_properties#aria-autocomplete>
 */
var AutocompleteInput = React.createClass({

  propTypes: {
    autocomplete: React.PropTypes.oneOf(['inline', 'both']),
    completionValue: React.PropTypes.string,
    onComplete: React.PropTypes.func,
    value: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      autocomplete: 'inline',
      completionValue: null,
      onComplete: emptyFunction,
      value: null
    };
  },

  /**
   * If there is a possible typeahead, mutates the DOM <input> node to have the
   * typeahead text and selects the range beyond what the user typed.
   */
  updateCompletionTypeahead: function() {
    // We only want to autocomplete when we have an option to complete in the 
    // textbox, and when the user is actively typing content into the textbox.
    // Typing ahead when deleting text feels annoying.
  
    if (this.props.completionValue === null || 
        this.isTypingForward !== true) {
      return;
    }

    var input = this.refs['input'].getDOMNode();
    var {value, completionValue} = this.props;
    var typeahead = getCompletionTypeahead(value, completionValue);

    if (typeahead !== null) {
      input.value = typeahead.valueWithCompletion;
      input.setSelectionRange(typeahead.start, typeahead.end);
    }
  },

  /**
   * Returns true if and only if there's a `completionValue` to typeahead and 
   * complete, and the beginning of `completionValue` is the same as `value` 
   * (case insensitively), so that a typeahead actually visually makes sense.
   */
  isCompletionPossible: function() {
    var {value, completionValue} = this.props;
    return getCompletionTypeahead(value, completionValue) !== null;
  },

  /**
   * Takes the current typehead value, and actually changes the final value of 
   * the input to contain the typeahead value.
   */
  complete: function() {
    if (!this.isCompletionPossible()) {
      return;
    }

    var {completionValue} = this.props;
    var end = completionValue.length;
    this.refs['input'].getDOMNode().setSelectionRange(end, end);
    this.props.onComplete(completionValue);
  },

  handleBlur: function(event) {
    this.complete();
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
    return (
      <input
        {...this.props}
        ref="input"
        onBlur={this.handleBlur}
        onKeyDown={this.handleKeyDown}
        onKeyUp={this.handleKeyUp}
      />
    );
  }

});

module.exports = AutocompleteInput;
