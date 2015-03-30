var React = require('react');

var ComboboxPopup = React.createClass({

  propTypes: {
    isOpen: React.PropTypes.bool
  },

  render: function() {
    return (
      <div className={joinClasses(
        'Combobox-popup',
        this.props.isOpen && 'Combobox-popup--is-open'
      )}>
        {this.renderPopupContent()}
      </div>
    );
  }

});

module.exports = ComboboxPopup;