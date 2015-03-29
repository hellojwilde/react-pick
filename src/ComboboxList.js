var React = require('react');
var ComboboxListOption = require('./ComboboxListOption');
var ComboboxKeyBindings = require('./ComboboxKeyBindings');

var getActiveDescendantId = require('./getActiveDescendantId');

var ComboboxList = React.createClass({

  propTypes: {
    getLabelForOption: React.PropTypes.func.isRequired,
    renderOption: React.PropTypes.func,
    inputValue: React.PropTypes.string,
    onRequestClose: React.PropTypes.func.isRequired,
    onRequestSelect: React.PropTypes.func.isRequired,
    onRequestFocus: React.PropTypes.func.isRequired,
    optionIndex: React.PropTypes.number,
    options: React.PropTypes.array.isRequired,
    popupId: React.PropTypes.string.isRequired
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
    return (
      <div id={this.props.popupId} className="ComboboxList">
        {this.props.options.map((option, index) => {
          var label = this.props.getLabelForOption(option);

          return (
            <ComboboxKeyBindings {...this.props} key={index} ref={index}>
              <ComboboxListOption 
                id={getActiveDescendantId(this.props.popupId, index)}
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

module.exports = ComboboxList;