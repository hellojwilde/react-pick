var ExampleConstants = require('../ExampleConstants');
var React = require('react');
var StateInput = require('./StateInput');

var App = React.createClass({

  getInitialState: function() {
    return {
      value: {
        inputValue: '',
        selectedValue: null
      }
    };
  },

  handleChange: function(value) {
    this.setState({value});
  },

  handleComplete: function(value) {
    this.setState({value});
  },

  render: function() {
    return (
      <div>
        <h1>react-pick</h1>
        <h2>Basic Example</h2>
        <p>
          <a href={`${ExampleConstants.publicPath}/basic`}>
            Demo Source
          </a>
        </p>
        <p>Selected State: </p>
        <StateInput 
          value={this.state.value} 
          onChange={this.handleChange}
          onComplete={this.handleComplete}
        />
        <div><button>something else to focus</button></div>
      </div>
    );
  }

});

React.render(<App/>, document.body);
