var AutocompleteInput = require('./AutocompleteInput');
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

    getLabelForOption: React.PropTypes.func,
    popupComponent: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      autocomplete: 'both',
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
        optionIndex: (options.length > 0) ? 0 : null
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
    var option = this.state.options[this.state.optionIndex];

    this.setState({isOpen: false});
    this.props.onChange({
      inputValue: this.props.getLabelForOption(option),
      selectedValue: option
    });
  },

  handleCancel: function() {
    this.setState({optionIndex: null, isOpen: false});
  },

  renderPopup: function() {
    return (
      <ListPopup 
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
    var {getLabelForOption, value} = this.props;
    var option = (optionIndex !== null) ? options[optionIndex] : null;

    return (
      <InputPopupWrapper isOpen={isOpen} popup={this.renderPopup()}>
        <ListKeyBindings 
          optionsLength={options.length}
          optionIndex={optionIndex}
          onChange={this.handleListChange}
          onComplete={this.handleComplete}
          onCancel={this.handleCancel}>
          <AutocompleteInput
            aria-autocomplete="both"
            completionValue={option && getLabelForOption(option)}
            value={value.inputValue}
            onChange={this.handleInputChange} 
            onComplete={this.handleComplete}
          />
        </ListKeyBindings>
      </InputPopupWrapper>
    );
  }

});

module.exports = Combobox;