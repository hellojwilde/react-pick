var React = require('react');

var getActiveDescendantId = require('./getActiveDescendantId');

require('./ComboboxInput.css');

var ComboboxInput = React.createClass({

  propTypes: {
    autocomplete: React.PropTypes.oneOf(['both', 'inline', 'list']).isRequired,
    autocompleteOption: React.PropTypes.any,
    getLabelForOption: React.PropTypes.func.isRequired,
    getLabelSelectionRange: React.PropTypes.func.isRequired,
    inputValue: React.PropTypes.string.isRequired,
    onRequestChange: React.PropTypes.func.isRequired,
    onRequestSelect: React.PropTypes.func.isRequired,
    optionIndex: React.PropTypes.number,
    popupId: React.PropTypes.string.isRequired
  },

  getInitialState: function() {
    return {
      isInputIncreasing: false 
    };
  },

  componentWillReceiveProps: function(nextProps) {
    var inputLength = this.props.inputValue.length;
    var nextInputLength = nextProps.inputValue.length;

    if (inputLength !== nextInputLength) {
      this.setState({isInputIncreasing: nextInputLength > inputLength});
    }
  },

  componentDidUpdate: function(prevProps, prevState) {
    // We only want to autocomplete when we have an option to complete in the 
    // textbox, and when the user is actively typing content into the textbox.
    // Typing ahead when deleting text feels annoying.

    if (this.props.autocompleteOption == null ||
        !this.state.isInputIncreasing) {
      return;
    }

    // Provided that we have an autocomplete option, and we're not currently
    // trying getting rid of text from the box, inset a possible autocompletion
    // result and highlight the part that was inserted.

    var input = this.refs.input.getDOMNode();
    var {inputValue, autocompleteOption} = this.props;
    var label = this.props.getLabelForOption(autocompleteOption);
    var range = this.props.getLabelSelectionRange(inputValue, label);

    if (range) {
      input.value = label;
      input.setSelectionRange(range.start, range.end);
    }
  },

  select: function() {
    var {autocompleteOption, onRequestSelect} = this.props;
    autocompleteOption && onRequestSelect(autocompleteOption);
  },

  handleChange: function(event) {
    this.props.onRequestChange(event.target.value);
  },

  handleBlur: function() {
    this.select();
  },

  render: function() {
    return (
      <input
        ref="input"
        className="ComboboxInput"
        value={this.props.inputValue}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        role="combobox"
        aria-activedescendant={getActiveDescendantId(
          this.props.popupId,
          this.props.optionIndex
        )}
        aria-autocomplete={this.props.autocomplete}
        aria-owns={this.props.popupId}
        {...this.props}
      />
    );
  }

});

module.exports = ComboboxInput;