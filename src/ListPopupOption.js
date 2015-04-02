var React = require('react');

var joinClasses = require('react/lib/joinClasses');

/**
 * <ListPopupOption> is a default implementation for rows rendered for the 
 * `options` in the <ListPopup> component.
 *
 * To render the provided `option`, <ListPopupOption> displays the string label
 * as determined by the `getLabelForOption` function.
 */
var ListPopupOption = React.createClass({

  propTypes: {
    getLabelForOption: React.PropTypes.func.isRequired,
    option: React.PropTypes.any.isRequired
  },

  render: function() {
    var {option, getLabelForOption, ...otherProps} = this.props;

    return (
      <div {...otherProps}>
        {getLabelForOption(option)}
      </div>
    );
  }

});

module.exports = ListPopupOption;