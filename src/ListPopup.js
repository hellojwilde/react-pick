var ListPopupOption = require('./ListPopupOption');
var React = require('react/addons');

var {PureRenderMixin} = React.addons;

var emptyFunction = require('./helpers/emptyFunction');
var getUniqueId = require('./helpers/getUniqueId');
var joinClasses = require('react/lib/joinClasses');

/**
 * <ListPopup> is a component that renders the list that Combobox displays.
 */
var ListPopup = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    getLabelForOption: React.PropTypes.func.isRequired,
    onChange: React.PropTypes.func,
    onComplete: React.PropTypes.func,
    optionComponent: React.PropTypes.func,
    optionIndex: React.PropTypes.number,
    options: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      onChange: emptyFunction,
      onComplete: emptyFunction,
      optionComponent: ListPopupOption,
      optionIndex: null,
      options: []
    };
  },

  handleOptionMouseEnter: function(idx, event) {
    this.props.onChange(idx);
  },

  handleOptionClick: function(idx, event) {
    this.props.onComplete(idx);
  },

  render: function() {
    var OptionComponent = this.props.optionComponent;
    var {
      className,
      optionIndex, 
      options,
      getLabelForOption, 
      onChange,
      onComplete,
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
              className={joinClasses(
                'ListPopup-option', 
                (idx === optionIndex) && 'ListPopup-option--isFocused'
              )}
              getLabelForOption={getLabelForOption}
              key={idx}
              onClick={this.handleOptionClick.bind(this, idx)}
              onMouseEnter={this.handleOptionMouseEnter.bind(this, idx)}
              option={option}
              role="listitem"
            />
          );
        })}
      </div>
    );
  }

});

module.exports = ListPopup;