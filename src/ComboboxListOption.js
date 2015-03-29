var React = require('react');

var joinClasses = require('react/lib/joinClasses');

require('./ComboboxListOption.css');

var ComboboxListOption = React.createClass({

  propTypes: {
    onRequestSelect: React.PropTypes.func.isRequired,
    onRequestFocus: React.PropTypes.func.isRequired,
    option: React.PropTypes.any.isRequired, 
    optionIndex: React.PropTypes.number,
    isSelected: React.PropTypes.bool,
    renderOption: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      isSelected: false,
      renderOption: (option) => option+'',
    };
  },

  select: function() {
    this.props.onRequestSelect(this.props.option)
  },

  handleMouseEnter: function() {
    this.props.onRequestFocus(this.props.optionIndex);
  },

  render: function() {
    var {className, renderOption, option, ...otherProps} = this.props;

    return (
      <div
        tabIndex="-1"
        role="option"
        className={joinClasses(
          'ComboboxListOption', 
          this.props.isSelected && 'ComboboxListOption--isSelected',
          className
        )}
        onMouseEnter={this.handleMouseEnter}
        {...otherProps}>
        {renderOption(option)}
      </div>
    );
  }

});

module.exports = ComboboxListOption;
