var ListPopupOption = require('./ListPopupOption');
var TimeoutMixin = require('./helpers/TimeoutMixin');
var React = require('react');

var emptyFunction = require('./helpers/emptyFunction');
var getUniqueId = require('./helpers/getUniqueId');
var joinClasses = require('react/lib/joinClasses');

/**
 * <ListPopup> is a component that renders the list that Combobox displays.
 */
var ListPopup = React.createClass({

  mixins: [TimeoutMixin],

  propTypes: {
    getLabelForOption: React.PropTypes.func.isRequired,
    focusedIndex: React.PropTypes.number,
    onBlur: React.PropTypes.func,
    onChange: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    onFocus: React.PropTypes.func,
    optionComponent: React.PropTypes.component,
    options: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      focusedIndex: null,
      onBlur: emptyFunction,
      onChange: emptyFunction,
      onComplete: emptyFunction,
      onFocus: emptyFunction,
      optionComponent: ListPopupOption,
      options: []
    };
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.focusedIndex !== prevProps.focusedIndex &&
        this.props.focusedIndex !== null) {
      this.refs[this.props.focusedIndex].getDOMNode().focus();
      prevProps.focusedIndex || this.props.onFocus();
    }
  },

  handleOptionMouseEnter: function(idx, event) {
    this.props.onChange(idx);
  },

  handleOptionFocus: function(idx, event) {
    this.clearTimeout(this.blurTimeoutId);
    this.props.onChange(idx);
  },

  handleOptionBlur: function(idx, event) {
    this.blurTimeoutId = this.setTimeout(() => {
      this.props.onChange(null);
      this.props.onBlur();
    }, 0);
  },

  handleOptionClick: function(idx, event) {
    this.props.onComplete(idx);
  },

  render: function() {
    var OptionComponent = this.props.optionComponent;
    var {
      className, 
      options, 
      getLabelForOption, 
      ...otherProps
    } = this.props;

    return (
      <div 
        {...otherProps} 
        className={joinClasses('ListPopup', className)}
        role="listbox">
        {options.map((option, idx) => {
          return (
            <OptionComponent
              className="ListPopup-option"
              getLabelForOption={getLabelForOption}
              key={idx}
              onBlur={this.handleOptionBlur.bind(this, idx)}
              onClick={this.handleOptionClick.bind(this, idx)}
              onFocus={this.handleOptionFocus.bind(this, idx)}
              onMouseEnter={this.handleOptionMouseEnter.bind(this, idx)}
              option={option}
              ref={idx}
              role="listitem"
            />
          );
        })}
      </div>
    );
  }

});

module.exports = ListInput;