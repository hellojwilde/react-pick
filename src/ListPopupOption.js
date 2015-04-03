var React = require('react/addons');

var {PureRenderMixin} = React.addons;

/**
 * <ListPopupOption> is a default implementation for rows rendered for the 
 * `options` in the <ListPopup> component. For the row content, it displays the 
 * string label as determined by the `getLabelForOption` function.
 */
var ListPopupOption = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    /**
     * Function that takes an `option` value, and returns a string label.
     */
    getLabelForOption: React.PropTypes.func.isRequired,

    /**
     * Option value that the row is representing.
     */
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