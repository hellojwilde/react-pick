var ListOption = require('./ListOption');
var React = require('react');
var PureRenderMixin = require('react-addons-pure-render-mixin');

var classNames = require('classnames');

/**
 * <List> is a component that renders the list that Combobox displays.
 */
var List = React.createClass({

  mixins: [PureRenderMixin],

  propTypes: {
    /**
     * Function that given an `index` of an option, returns an ID that should
     * be unique across the document, but deterministic--multiple calls of this
     * function with the same `index` should return the same ID.
     *
     * Useful for assigning `aria-activedescendant` in a parent component.
     */
    getDescendantIdForOption: React.PropTypes.func.isRequired,

    /**
     * Function that takes an `option` value, and returns a string label.
     */
    getLabelForOption: React.PropTypes.func.isRequired,

    /**
     * Event handler called if the user does an action to change `optionIndex`.
     * The function called receives the value of `optionIndex` to change to.
     */
    onChange: React.PropTypes.func.isRequired,

    /**
     * Event handler called if the user does an action to complete a given 
     * option into the parent <Combobox> as the value. The function called 
     * receives the value of `optionIndex` to complete.
     */
    onComplete: React.PropTypes.func.isRequired,

    /**
     * The React component to use render for each option of the list popup. 
     * The component must support rendering passed properties and `className`, 
     * and will receive the `option` and `getLabelForOption` to help with 
     * rendering.
     */
    optionComponent: React.PropTypes.func,

    /**
     * The currently focused index of the list view.
     */
    optionIndex: React.PropTypes.number,

    /**
     * The different option values that the user is selecting between.
     */
    options: React.PropTypes.array
  },

  getDefaultProps: function() {
    return {
      optionComponent: ListOption,
      optionIndex: null,
      options: []
    };
  },

  handleOptionMouseEnter: function(idx, event) {
    this.props.onChange(idx);
  },

  handleOptionClick: function(idx, event) {
    this.props.onComplete(idx);
  },

  render: function() {
    var OptionComponent = this.props.optionComponent;
    var {
      className,
      optionIndex, 
      options,
      getLabelForOption, 
      getDescendantIdForOption,
      ...otherProps
    } = this.props;

    return (
      <ul 
        {...otherProps} 
        className={classNames('List', className)}
        role="listbox">
        {options.map((option, idx) => {
          return (
            <OptionComponent
              className={classNames(
                'List-option', {
                'List-option--isFocused': idx === optionIndex
                }
              )}
              id={getDescendantIdForOption(idx)}
              getLabelForOption={getLabelForOption}
              key={idx}
              onClick={this.handleOptionClick.bind(this, idx)}
              onMouseEnter={this.handleOptionMouseEnter.bind(this, idx)}
              option={option}
              role="listitem"
            />
          );
        })}
      </ul>
    );
  }

});

module.exports = List;