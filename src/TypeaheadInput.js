var React = require('react/addons');

var {PureRenderMixin} = React.addons;

var emptyFunction = require('./helpers/emptyFunction');

const KEY_BACKSPACE = 8;

function getCompletionTypeahead(value, typeaheadValue) {
  value = (value || '').toLowerCase();
  typeaheadValue = (typeaheadValue || '').toLowerCase();

  if (value === '' || value === typeaheadValue) {
    return null;
  } else if (typeaheadValue.indexOf(value) !== 0) {
    return null;
  } else {
    var start = value.length;
    var end = typeaheadValue.length;
    var valueWithTypeahead = value + typeaheadValue.slice(start, end);

    return {valueWithTypeahead, start, end};
  }
}

/**
 * <TypeaheadInput> is a lightweight wrapper around <input>, enabling
 * a UI to show text "typed ahead" of the user's current input. This is useful
 * for displaying a prediction about what the user is going to type next.
 *
 * To use the component, you just supply two additional properties over what
 * you normally would for an <input> element:
 *
 *  - `typeaheadValue`, the full predicted string to type into the textbox.
 *    For example, if you were trying to autocomplete dates, and the user typed 
 *    "Calif", you might supply "California" for this, and
 *  - `onComplete`, an event handler for when the user tabs or otherwise does
 *    an action to complete the text in the component.
 *
 * This component attempts to conform to WAI-ARIA's autocomplete requirements:
 * <http://www.w3.org/TR/wai-aria/states_and_properties#aria-autocomplete>
 */
var TypeaheadInput = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    typeaheadValue: React.PropTypes.string,
    value: React.PropTypes.string
  },

  getDefaultProps: function() {
    return {
      typeaheadValue: null,
      onKeyUp: emptyFunction,
      value: null
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.typeaheadValue !== prevProps.typeaheadValue) {
      this.updateTypeahead();
    }
  },

  /**
   * If there is a possible typeahead, mutates the DOM <input> node to have the
   * typeahead text and selects the range beyond what the user typed.
   */
  updateTypeahead: function() {
    // We only want to typeahead when we have an option to complete in the 
    // textbox, and when the user is actively typing content into the textbox.
    // Typing ahead when deleting text feels annoying.
  
    if (this.props.typeaheadValue === null || 
        this.isTypingForward !== true) {
      return;
    }

    var input = this.refs['input'].getDOMNode();
    var {value, typeaheadValue} = this.props;
    var typeahead = getCompletionTypeahead(value, typeaheadValue);

    if (typeahead !== null) {
      input.value = typeahead.valueWithTypeahead;
      input.setSelectionRange(typeahead.start, typeahead.end);
    }
  },

  handleKeyUp: function(event) {
    this.isTypingForward = event.keyCode !== KEY_BACKSPACE;
    this.updateTypeahead();
    this.props.onKeyUp(event);
  },

  render: function() {
    return (
      <input
        {...this.props}
        aria-autocomplete={this.props['aria-autocomplete'] || 'inline'}
        ref="input"
        onKeyUp={this.handleKeyUp}
      />
    );
  }

});

module.exports = TypeaheadInput;
