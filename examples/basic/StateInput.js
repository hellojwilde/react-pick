var React = require('react');
var StateData = require('./StateData');
var {Combobox} = require('../../src');
require('../../src/styles.css');

var StateInput = React.createClass({

  getOptionsForInputValue: function(inputValue) {
    return new Promise((resolve, reject) => {
      var search = inputValue.toLowerCase();
      if (search === '') {
        resolve(StateData);
        return;
      }

      // In a real-world scenario, you might defer to a remote server for 
      // your autocompletion. The promise-based API makes it easy to do 
      // asynchronous autocompletion.
      
      window.setTimeout(() => {
        resolve(StateData.filter((state) => (
          state.name.toLowerCase().indexOf(search) === 0 || 
          state.id.toLowerCase().indexOf(search) === 0
        )));
      }, 500);
    });
  },

  getLabelForOption: function(value) {
    return value.name;
  },

  render: function() {
    return (
      <Combobox 
        {...this.props}
        getOptionsForInputValue={this.getOptionsForInputValue}
        getLabelForOption={this.getLabelForOption}
      />
    );
  }

});

module.exports = StateInput;