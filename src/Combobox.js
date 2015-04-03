var TypeaheadInput = require('./TypeaheadInput');
var InputPopupWrapper = require('./InputPopupWrapper');
var ListPopup = require('./ListPopup');
var ListKeyBindings = require('./ListKeyBindings');
var React = require('react/addons');

var {PureRenderMixin} = React.addons;

var emptyFunction = require('./helpers/emptyFunction');

/**
 * <Combobox> is a combobox-style widget that supports both inline- and 
 * menu-based autocompletion based on an asynchonously-loaded result set.
 */
var Combobox = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    getOptionsForInput: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func.isRequired,
    value: React.PropTypes.shape({
      inputValue: React.PropTypes.string,
      selectedValue: React.PropTypes.any
    }).isRequired,

    autocomplete: React.PropTypes.oneOf(['menu', 'inline', 'both']),
    onSelect: React.PropTypes.func,
    getLabelForOption: React.PropTypes.func,
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
      isOpen: false,
      options: [],
      optionIndex: null
    };
  },

  isInlineCompleting: function() {
    return ['inline', 'both'].indexOf(this.props.autocomplete) !== -1;
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

  updateOptionsForInput: function(inputValue) {
    var optionsPromise = this.optionsPromise =
      this.props.getOptionsForInput(inputValue);
    
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
    this.updateOptionsForInput(inputValue);
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

    if (this.state.optionIndex) {
      var option = this.state.options[this.state.optionIndex];
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
      />
    ); 
  },

  render: function() {
    var {isOpen, optionIndex, options} = this.state;

    return (
      <InputPopupWrapper 
        isOpen={this.getMenuIsOpen()} 
        popup={this.renderPopup()}>
        <ListKeyBindings 
          optionsLength={options.length}
          optionIndex={optionIndex}
          onChange={this.handleListChange}
          onComplete={this.handleComplete}
          onCancel={this.handleCancel}>
          <TypeaheadInput
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