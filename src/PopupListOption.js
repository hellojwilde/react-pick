var React = require('react');

var joinClasses = require('react/lib/joinClasses');

require('./PopupListOption.css');

var PopupListOption = React.createClass({

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
          'PopupListOption', 
          this.props.isSelected && 'PopupListOption--isSelected',
          className
        )}
        onClick={this.select}
        onMouseEnter={this.handleMouseEnter}
        {...otherProps}>
        {renderOption(option)}
      </div>
    );
  }

});

module.exports = PopupListOption;
