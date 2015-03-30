var ExampleConstants = require('../ExampleConstants');
var React = require('react');
var AutocompleteInput = require('../../src/AutocompleteInput');

var App = React.createClass({

  getInitialState: function() {
    return {
      value: ''
    };
  },

  handleChange: function(value) {
    this.setState({value: value});
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
        <AutocompleteInput 
          completionValue="California"
          value={this.state.value} 
          onChange={this.handleChange}
          onComplete={(change) => console.log(change)}
        />
        <div><button>something else to focus</button></div>
      </div>
    );
  }

});

React.render(<App/>, document.body);
