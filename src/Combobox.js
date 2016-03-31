import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
var List = require('./List');
var InputWithPopup = require('./InputWithPopup');
var ListKeyBindings = require('./ListKeyBindings');
var TypeaheadInput = require('./TypeaheadInput');

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
     * An object for the current value of the <Combobox>. This will be filled
     * with a possible autocompletion value, as opposed to direct input from
     * the user.
     */
    value: React.PropTypes.any,

    /**
     * The type of autocompletion behavior:
     *   - `menu` to display a popup menu with autocompletion options.
     *   - `inline` to display the first autocompletion option as text 
     *      "typed ahead" of the user's input.
     *   - `both` to display both at once.
     * Default is `both`.
     */
    autoComplete: React.PropTypes.oneOf(['menu', 'inline', 'both']),

    /**
     * Event handler fired when `value` changes to a new non-`null` value. 
     * Function called is passed `value`.
     */
    onComplete: React.PropTypes.func,

    /**
     * Function that takes an `option` value, and returns a string label.
     * Default is a function that coerces the `option` to a string.
     */
    getLabelForOption: React.PropTypes.func,

    /**
     * The component to render for the list in the popup.
     * Default is `List`.
     */
    listComponent: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      autoComplete: 'both',
      onComplete: emptyFunction,
      getLabelForOption: (option) => option+'',
      listComponent: List
    };
  },

  getInitialState: function() {
    var {value, getLabelForOption} = this.props;

    return {
      id: getUniqueId('Combobox'),
      isOpen: false,
      inputValue: value && getLabelForOption(value),
      options: [],
      optionIndex: null
    };
  },

  componentWillReceiveProps: function(nextProps) {
    if (this.props.value !== nextProps.value && 
        nextProps.value !== null) {
      this.setState({
        inputValue: this.props.getLabelForOption(nextProps.value)
      });
    }
  },

  isInlineCompleting: function() {
    return ['inline', 'both'].indexOf(this.props.autoComplete) !== -1;
  },

  getDescendantIdForOption: function(idx) {
    return (idx !== null) ? `${this.state.id}-${idx}` : null;
  },

  getMenuIsOpen: function() {
    var isMenuCompleting =
      ['menu', 'both'].indexOf(this.props.autoComplete) !== -1;

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

    this.setState({optionIndex: null, inputValue: inputValue});
    this.updateOptionsForInputValue(inputValue);
    this.props.onChange(null);
  },

  handleInputKeyDown: function(event) {
    var {isOpen, optionIndex, options} = this.state;

    ListKeyBindings.handleKeyDown({
      optionsLength: options.length,
      optionIndex: optionIndex,
      onChange: this.handleListChange,
      onComplete: this.handleComplete,
      onCancel: this.handleCancel
    }, event);
  },

  handleListChange: function(optionIndex) {
    this.setState({optionIndex});
  },

  handleComplete: function() {
    this.setState({isOpen: false});

    if (this.state.optionIndex !== null) {
      var option = this.state.options[this.state.optionIndex];

      this.setState({optionIndex: null});
      this.props.onChange(option);
      this.props.onComplete(option);
    }
  },

  handleCancel: function() {
    this.setState({optionIndex: null, isOpen: false});
  },

  render: function() {
    var {optionIndex} = this.state;
    var {autoComplete, ...otherProps} = this.props;

    var ListComponent = this.props.listComponent;

    return (
      <InputWithPopup
        {...otherProps}
        aria-activedescendant={this.getDescendantIdForOption(optionIndex)}
        aria-autocomplete={autoComplete}
        isOpen={this.getMenuIsOpen()}
        onBlur={this.handleComplete}
        onChange={this.handleInputChange}
        onKeyDown={this.handleInputKeyDown}
        typeaheadValue={this.getInputTypeaheadValue()}
        value={this.state.inputValue}
        inputComponent={TypeaheadInput}>
        <ListComponent 
          options={this.state.options}
          optionIndex={this.state.optionIndex}
          onChange={this.handleListChange}
          onComplete={this.handleComplete}
          getLabelForOption={this.props.getLabelForOption}
          getDescendantIdForOption={this.getDescendantIdForOption}
        />
      </InputWithPopup>
    );
  }

});

module.exports = Combobox;