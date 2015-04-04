var React = require('react/addons');

var {PureRenderMixin} = React.addons;

/**
 * <ListOption> is a default implementation for rows rendered for the 
 * `options` in the <List> component. For the row content, it displays the 
 * string label as determined by the `getLabelForOption` function.
 */
var ListOption = React.createClass({

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
      <li {...otherProps}>
        {getLabelForOption(option)}
      </li>
    );
  }

});

module.exports = ListOption;