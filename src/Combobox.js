var InputPopupWrapper = require('./InputPopupWrapper');
var ListKeyBindings = require('./ListKeyBindings');
var ListPopup = require('./ListPopup');
var React = require('react/addons');
var TypeaheadInput = require('./TypeaheadInput');

var {PureRenderMixin} = React.addons;

var emptyFunction = require('./helpers/emptyFunction');
var getUniqueId = require('./helpers/getUniqueId');

/**
 * <Combobox> is a combobox-style widget that supports both inline- and 
 * menu-based autocompletion based on an asynchonously-loaded result set.
 */
var Combobox = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    /**
     * A function that fetches the autocomplete options for typed user input.
     * It takes the `value` of the <input>, and returns a promise that resolves
     * with an array of autocomplete options.
     */
    getOptionsForInputValue: React.PropTypes.func.isRequired,

    /**
     * Event handler fired when the `value` of the component changes.
     * Function called is passed `value`.
     */
    onChange: React.PropTypes.func.isRequired,

    /**
     * An object for the current value of the <Combobox> with two properties:
     *   - `inputValue`, the text that the user entered into the <Combobox>
     *     or was autocompleted as label for the selected value.
     *   - `selectedValue`, the value from the autocomplete options that the 
     *     user selected.
     */
    value: React.PropTypes.shape({
      inputValue: React.PropTypes.string,
      selectedValue: React.PropTypes.any
    }).isRequired,

    /**
     * The type of autocompletion behavior:
     *   - `menu` to display a popup menu with autocompletion options.
     *   - `inline` to display the first autocompletion option as text 
     *      "typed ahead" of the user's input.
     *   - `both` to display both at once.
     * Default is `both`.
     */
    autocomplete: React.PropTypes.oneOf(['menu', 'inline', 'both']),

    /**
     * Event handler fired when `value.selectedValue` changes to a new 
     * non-`null` value. Function called is passed `value.selectedValue`.
     */
    onSelect: React.PropTypes.func,

    /**
     * Function that takes an `option` value, and returns a string label.
     * Default is a function that coerces the `option` to a string.
     */
    getLabelForOption: React.PropTypes.func,

    /**
     * The component to render for the popup.
     * Default is `ListPopup`.
     */
    popupComponent: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      autocomplete: 'both',
      onSelect: emptyFunction,
      getLabelForOption: (option) => option+'',
      popupComponent: ListPopup
    };
  },

  getInitialState: function() {
    return {
      id: getUniqueId('Combobox'),
      isOpen: false,
      options: [],
      optionIndex: null
    };
  },

  isInlineCompleting: function() {
    return ['inline', 'both'].indexOf(this.props.autocomplete) !== -1;
  },

  getDescendantIdForOption: function(idx) {
    return (idx !== null) ? `${this.state.id}-${idx}` : null;
  },

  getMenuIsOpen: function() {
    var isMenuCompleting =
      ['menu', 'both'].indexOf(this.props.autocomplete) !== -1;

    return this.state.isOpen && isMenuCompleting;
  },

  getInputTypeaheadValue: function() {
    var {options, optionIndex} = this.state;
    
    if (!this.isInlineCompleting() || optionIndex === null) {
      return null;
    }

    return this.props.getLabelForOption(options[optionIndex]);
  },

  updateOptionsForInputValue: function(inputValue) {
    var optionsPromise = this.optionsPromise =
      this.props.getOptionsForInputValue(inputValue);
    
    optionsPromise.then((options) => {
      // It's possible that when we're fetching, we may get out-of-order
      // promise resolutions, even for cases like a contrived setTimeout demo.
      // This leads to really wonky behavior.
      // 
      // Ensure that we only update the state based on the most recent promise
      // that was started for fetching.
    
      if (this.optionsPromise !== optionsPromise) {
        return;
      }

      this.setState({
        isOpen: options.length > 0,
        options: options,
        optionIndex: (this.isInlineCompleting() && options.length) ? 0 : null
      });
    });
  },

  handleInputChange: function(event) {
    var inputValue = event.target.value;

    this.setState({optionIndex: null});
    this.updateOptionsForInputValue(inputValue);
    this.props.onChange({
      inputValue: inputValue,
      selectedValue: null
    });
  },

  handleListChange: function(optionIndex) {
    this.setState({optionIndex});
  },

  handleComplete: function() {
    this.setState({isOpen: false});

    if (this.state.optionIndex !== null) {
      var option = this.state.options[this.state.optionIndex];

      this.setState({optionIndex: null});
      this.props.onSelect(option);
      this.props.onChange({
        inputValue: this.props.getLabelForOption(option),
        selectedValue: option
      });
    }
  },

  handleCancel: function() {
    this.setState({optionIndex: null, isOpen: false});
  },

  renderPopup: function() {
    var PopupComponent = this.props.popupComponent;

    return (
      <PopupComponent 
        options={this.state.options}
        optionIndex={this.state.optionIndex}
        onChange={this.handleListChange}
        onComplete={this.handleComplete}
        getLabelForOption={this.props.getLabelForOption}
        getDescendantIdForOption={this.getDescendantIdForOption}
      />
    ); 
  },

  render: function() {
    var {isOpen, optionIndex, options} = this.state;
    var {autocomplete, ...otherProps} = this.props;

    return (
      <InputPopupWrapper 
        isOpen={this.getMenuIsOpen()} 
        popupElement={this.renderPopup()}>
        <ListKeyBindings 
          optionsLength={options.length}
          optionIndex={optionIndex}
          onChange={this.handleListChange}
          onComplete={this.handleComplete}
          onCancel={this.handleCancel}>
          <TypeaheadInput
            {...otherProps}
            aria-activedescendant={this.getDescendantIdForOption(optionIndex)}
            aria-autocomplete={this.props.autocomplete}
            typeaheadValue={this.getInputTypeaheadValue()}
            value={this.props.value.inputValue}
            onChange={this.handleInputChange}
            onBlur={this.handleComplete}
          />
        </ListKeyBindings>
      </InputPopupWrapper>
    );
  }

});

module.exports = Combobox;