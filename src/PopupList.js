var React = require('react');
var PopupListOption = require('./PopupListOption');
var ComboboxKeyBindings = require('./ComboboxKeyBindings');

var getARIADescendantId = require('./helpers/getARIADescendantId');

var PopupList = React.createClass({

  propTypes: {
    getLabelForOption: React.PropTypes.func.isRequired,
    id: React.PropTypes.string.isRequired,
    inputValue: React.PropTypes.string,
    onRequestClose: React.PropTypes.func.isRequired,
    onRequestFocus: React.PropTypes.func.isRequired,
    onRequestSelect: React.PropTypes.func.isRequired,
    optionIndex: React.PropTypes.number,
    options: React.PropTypes.array.isRequired,
    renderOption: React.PropTypes.func,
  },

  componentDidUpdate: function(prevProps, prevState) {
    if (this.props.optionIndex != prevProps.optionIndex &&
        this.props.optionIndex != null) {
      this.refs[this.props.optionIndex].getDOMNode().focus();
    }
  },

  handleFocus: function() {
    clearTimeout(this.blurTimer);
  },

  handleBlur: function() {
    this.blurTimer = setTimeout(() => this.props.onRequestClose(), 0);
  },

  render: function() {
    var {id, ...otherProps} = this.props;

    return (
      <div id={id}>
        {this.props.options.map((option, index) => {
          var label = this.props.getLabelForOption(option);

          return (
            <ComboboxKeyBindings {...otherProps} key={index} ref={index}>
              <PopupListOption 
                id={getARIADescendantId(this.props.id, index)}
                option={option}
                optionIndex={index}
                renderOption={this.props.renderOption}
                isSelected={this.props.inputValue === label}
                onBlur={this.handleBlur}
                onFocus={this.handleFocus}
                onRequestSelect={this.props.onRequestSelect}
                onRequestFocus={this.props.onRequestFocus}
              />
            </ComboboxKeyBindings>
          );
        })}
      </div>
    );
  }

});

module.exports = PopupList;