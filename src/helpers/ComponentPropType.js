var React = require('react');

const ComponentPropType = React.PropTypes.oneOfType([
  React.PropTypes.string,
  React.PropTypes.func
]);

module.exports = ComponentPropType;
