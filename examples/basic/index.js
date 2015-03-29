var ExampleConstants = require('../ExampleConstants');
var React = require('react');
var StateInput = require('./StateInput');

var App = React.createClass({

  getInitialState: function() {
    return {
      comboboxValue: {
        inputValue: 'California', 
        selectedValue: {id: 'CA', name: 'California'}
      } 
    };
  },

  handleComboboxChange: function(comboboxValue) {
    this.setState({comboboxValue});
  },

  render: function() {
    var {selectedValue} = this.state.comboboxValue;

    return (
      <div>
        <h1>react-pick</h1>
        <h2>Basic Example</h2>
        <p>
          <a href={`${ExampleConstants.publicPath}/basic`}>
            Demo Source
          </a>
        </p>
        <p>Selected State: {selectedValue && selectedValue.id}</p>
        <StateInput 
          value={this.state.comboboxValue} 
          onChange={this.handleComboboxChange}
        />
        <div><button>something else to focus</button></div>
      </div>
    );
  }

});

React.render(<App/>, document.body);
