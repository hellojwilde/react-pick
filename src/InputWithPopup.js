var ComponentPropType = require('./helpers/ComponentPropType');
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var classNames = require('classnames');
var getUniqueId = require('./helpers/getUniqueId');

/**
 * <InputWithPopup> enables us to render an <input> (or other component with
 * similar contract) with an attached popup flyout.
 *
 * To use it, pass the values that you would normally pass to an <input> to
 * the <InputWithPopup>, and then toggle the 
 */
var InputWithPopup = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    /**
     * Boolean value that's true when the popup should be open.
     * Default is false.
     */
    isOpen: React.PropTypes.bool,

    /**
     * The component to render as the input element.
     * Default is <input>.
     */
    inputComponent: ComponentPropType,

    /**
     * The component to render as the wrapper around the popup.
     * Default is <div>
     */
    popupComponent: ComponentPropType
  },

  getDefaultProps: function() {
    return {
      isOpen: false,
      inputComponent: 'input',
      popupComponent: 'div'
    };
  },

  getInitialState: function() {
    return {
      id: getUniqueId('InputWithPopup')
    };
  },

  render: function() {
    var InputComponent = this.props.inputComponent;
    var PopupComponent = this.props.popupComponent;
    var {className, children, isOpen, ...otherProps} = this.props;

    return (
      <div className="InputWithPopup">
        <InputComponent
          {...otherProps}
          aria-haspopup="true"
          aria-owns={this.state.id}
          aria-expanded={isOpen+''}
          className={classNames('InputWithPopup-input', className)}
        />
        <PopupComponent
          id={this.state.id}
          className={classNames(
            'InputWithPopup-popup', {
            'InputWithPopup-popup--isOpen': isOpen
            }
          )}>
          {children}
        </PopupComponent>
      </div>
    );
  }

});

module.exports = InputWithPopup;