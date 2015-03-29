var React = require('react/addons');

var cloneWithProps = React.addons.cloneWithProps;

const PROP_BINDINGS = {
  27: 'onRequestClose',
  38: 'onRequestFocusPrevious',
  40: 'onRequestFocusNext'
};

const REF_BINDINGS = {
  13: 'select'
};

var ComboboxKeyBindings = React.createClass({

  propTypes: {
    onRequestClose: React.PropTypes.func.isRequired,
    onRequestFocusPrevious: React.PropTypes.func.isRequired,
    onRequestFocusNext: React.PropTypes.func.isRequired
  },

  handleKeyDown: function(event) {
    var propHandlerName = PROP_BINDINGS[event.keyCode];
    var refHandlerName = REF_BINDINGS[event.keyCode];

    if (!propHandlerName && !refHandlerName) {
      return;
    }

    event.preventDefault();

    propHandlerName && this.props[propHandlerName]();
    refHandlerName && this.refs['bound'][refHandlerName]();
  },

  render: function() {
    return cloneWithProps(React.Children.only(this.props.children), {
      ref: 'bound',
      onKeyDown: this.handleKeyDown
    });
  }

});

module.exports = ComboboxKeyBindings;