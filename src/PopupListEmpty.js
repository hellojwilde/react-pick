var React = require('react');

var PopupListEmpty = React.createClass({

  render: function() {
    return (
      <div aria-live="polite">No matches.</div>
    );
  }

});

module.exports = PopupListEmpty;
