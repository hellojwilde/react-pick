var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var emptyFunction = require('./helpers/emptyFunction');

const KEY_BACKSPACE = 8;

function getTypeahead(value, typeaheadValue) {
  var normalizedValue = (value || '').toLowerCase();
  var normalizedTypeaheadValue = (typeaheadValue || '').toLowerCase();

  if (normalizedValue === '' || normalizedValue === normalizedTypeaheadValue) {
    return null;
  } else if (normalizedTypeaheadValue.indexOf(normalizedValue) !== 0) {
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
 * To use the component, in addition to the properties you supply normally,
 * you supply `typeaheadValue`, the full string you want to have typed ahead.
 * For example, if the user typed "calif", and you wanted to suggest 
 * "California", you would supply "California" as the `typeaheadValue` as usual:
 *
 *    <TypeaheadInput value="calif" typeaheadValue="California"/>
 *
 * The value will be inserted into the underlying <input> as the user types.
 * The text beyond what the user typed will be selected so that they can type
 * over it. If the user types text that doesn't match "California", no value 
 * will be completed.
 * 
 * This component attempts to conform to WAI-ARIA's autocomplete requirements:
 * <http://www.w3.org/TR/wai-aria/states_and_properties#aria-autocomplete>.
 */
var TypeaheadInput = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    /**
     * The value that to type over and ahead of the user's current input.
     * This is the value that you're suggesting to the user.
     */
    typeaheadValue: React.PropTypes.string,

    /**
     * The value that the user intended to type into the textbox.
     * Semantically identical to the property with the same name on <input>.
     */
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

    var input = this.refs['input'];
    var {value, typeaheadValue} = this.props;
    var typeahead = getTypeahead(value, typeaheadValue);

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
