var ComboboxKeyBindings = require('./ComboboxKeyBindings');
var PopupList = require('./PopupList');
var PopupListEmpty = require('./PopupListEmpty');
var PopupListFetching = require('./PopupListFetching');
var React = require('react');
var TypeaheadInput = require('./TypeaheadInput');

var assign = require('object-assign');
var emptyFunction = require('./helpers/emptyFunction');
var getARIADescendantId = require('./helpers/getARIADescendantId');
var getLabelForOption = require('./defaults/getLabelForOption');
var joinClasses = require('react/lib/joinClasses');

var guid = 0;

var Combobox = React.createClass({

  propTypes: {
    /**
     * The current content value of the combobox:
     *  - `inputValue` is the text shown in the input of the combobox. 
     *    Defaults to ''.
     *  - `selectedValue` is the selected autocompletion value in the combobox.
     *    Defaults to null when nothing is selected.
     * @type {object}
     * @required
     */
    value: React.PropTypes.shape({
      inputValue: React.PropTypes.string,
      selectedValue: React.PropTypes.any
    }).isRequired,

    /**
     * Handler fired whenever the `value` changes with the updated value object.
     * @type {function}
     * @required
     */
    onChange: React.PropTypes.func.isRequired,

    /**
     * For a given input string typed by the user, calls a callback when
     * new autocompletion results are available.
     * @type {function}
     * @required
     */
    getOptionsForInput: React.PropTypes.func.isRequired,

    /**
     * The autocompletion behavior:
     *  - `inline` autocompletes the first matched value into the text box,
     *  - `list` displays a list of choices,
     *  - `both` displays both.
     * Default is `both`.
     * @type {string}
     */
    autocomplete: React.PropTypes.oneOf(['both', 'inline', 'list']),

    /**
     * For a given autocomplete value, returns the text that should be shown
     * in the input textbox of the autocomplete. Default is the value coerced
     * to a string.
     * @type {function}
     */
    getLabelForOption: React.PropTypes.func,

    /**
     * Handler fired whenever the user selects a given option.
     * @type {function}
     */
    onSelect: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      autocomplete: 'both',
      getLabelForOption: getLabelForOption,
      value: {inputValue: '', selectedValue: null},
      onSelect: emptyFunction
    };
  },

  getInitialState: function() {
    return {
      isOpen: false,
      isFetching: false,
      optionInline: null,
      optionIndex: null,
      options: [],
      popupId: 'Combobox-list-'+(++guid)
    };
  },

  fetchListOptions: function(inputValue, callback) {
    this.setState({isFetching: true});
    this.props.getOptionsForInput(
      inputValue, 
      (options) => this.setState({
        isFetching: false,
        options: options
      }, callback)
    );
  },

  isShowingMenu: function() {
    return ['list', 'both'].indexOf(this.props.autocomplete) !== -1;
  },

  isShowingInline: function() {
    return ['inline', 'both'].indexOf(this.props.autocomplete) !== -1;
  },

  handleRequestChange: function(inputValue) {
    this.setState({
      isOpen: this.isShowingMenu(),
      optionInline: null,
      optionIndex: null
    });

    this.props.onChange({
      inputValue: inputValue,
      selectedValue: null
    });

    this.fetchListOptions(inputValue, () => {
      if (this.state.options.length == 0 || !this.isShowingInline()) {
        return;
      }
      this.setState({optionInline: this.state.options[0]});
    });
  },

  handleRequestClose: function() {
    this.setState({isOpen: false});
  },

  handleRequestSelect: function(isFromOptions, selectedValue) {
    // XXX This is a hack to ensure that we don't close the popup if we're
    // somehow triggering a selection as we're moving into the popup.

    if (!isFromOptions && this.state.optionIndex != null) {
      return;
    }

    this.props.onSelect(selectedValue);
    this.props.onChange({
      inputValue: this.props.getLabelForOption(selectedValue),
      selectedValue: selectedValue
    });

    this.setState({isOpen: false});
  },

  handleRequestFocus: function(optionIndex) {
    this.setState({optionIndex});
  },

  handleRequestFocusNext: function() {
    var currentIndex = this.state.optionIndex;
    var lastIndex = this.state.options.length - 1;

    this.handleRequestFocus(
      (currentIndex == null || currentIndex >= lastIndex)
        ? 0 : currentIndex + 1
    );
  },

  handleRequestFocusPrevious: function() {
    var currentIndex = this.state.optionIndex;
    var lastIndex = this.state.options.length - 1;

    this.handleRequestFocus(
      (currentIndex == null || currentIndex <= 0)
        ? lastIndex : currentIndex - 1
    );
  },

  render: function() {
    var {autocomplete, value, className, ...otherProps} = this.props;

    return (
      <div className={joinClasses('Combobox', className)}>
        <ComboboxKeyBindings
          onRequestClose={this.handleRequestClose}
          onRequestFocusNext={this.handleRequestFocusNext}
          onRequestFocusPrevious={this.handleRequestFocusPrevious}>
          <TypeaheadInput
            {...otherProps}
            aria-activedescendant={getARIADescendantId(
              this.state.popupId,
              this.state.optionIndex
            )}
            aria-autocomplete={this.props.autocomplete}
            aria-owns={this.state.popupId}
            className="Combobox-input"
            value={value.inputValue}
            option={this.state.optionInline}
            onChange={this.handleRequestChange}
            onSelect={this.handleRequestSelect.bind(this, false)}
            role="combobox"
          />
        </ComboboxKeyBindings>
        <ComboboxPopup 
          {...otherProps}
          aria-expanded={this.state.isOpen+''}
          id={this.state.popupId}
          inputValue={this.props.value.inputValue}
          isFetching={this.state.isFetching}
          isOpen={this.state.isOpen}
          onRequestClose={this.handleRequestClose}
          onRequestFocus={this.handleRequestFocus}
          onRequestFocusNext={this.handleRequestFocusNext}
          onRequestFocusPrevious={this.handleRequestFocusPrevious}
          onRequestSelect={this.handleRequestSelect.bind(this, true)}
          optionIndex={this.state.optionIndex}
          options={this.state.options}
        />
      </div>
    );
  }
});

module.exports = Combobox;

