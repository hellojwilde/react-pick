var React = require('react/addons');

var {PureRenderMixin, cloneWithProps} = React.addons;

var joinClasses = require('react/lib/joinClasses');
var getUniqueId = require('./helpers/getUniqueId');

/**
 * <InputPopupWrapper> enables us to attach a popup menu like <ListPopup>
 * to an <input> element in an WAI ARIA compliant manner.
 */
var InputPopupWrapper = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    /**
     * Boolean value that's true when the popup should be open.
     */
    isOpen: React.PropTypes.bool,

    /**
     * The rendered React element that should be displayed in the popup.
     */
    popupElement: React.PropTypes.element
  },

  getDefaultProps: function() {
    return {
      isOpen: false,
      popupElement: <div/>
    };
  },

  getInitialState: function() {
    return {
      id: getUniqueId('InputPopupWrapper')
    };
  },

  render: function() {
    return (
      <div className="InputPopupWrapper">
        {cloneWithProps(React.Children.only(this.props.children), {
          'aria-haspopup': 'true',
          'aria-owns': this.state.id,
          'aria-expanded': this.props.isOpen+'',
          'className': 'InputPopupWrapper-input'
        })}
        <div
          id={this.state.id}
          className={joinClasses(
            'InputPopupWrapper-popup',
            this.props.isOpen && 'InputPopupWrapper-popup--isOpen'
          )}>
          {this.props.popupElement}
        </div>
      </div>
    );
  }

});

module.exports = InputPopupWrapper;