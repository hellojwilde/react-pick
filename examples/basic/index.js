var ExampleConstants = require('../ExampleConstants');
var React = require('react');
var ReactDOM = require('react-dom');
var StateInput = require('./StateInput');

var App = React.createClass({

  getInitialState: function() {
    return {
      value: {id: 'CA', name: 'California'}
    };
  },

  handleChange: function(value) {
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
        <p>Selected State: {this.state.value && this.state.value.id}</p>
        <StateInput 
          value={this.state.value} 
          onChange={this.handleChange}
        />
        <div><button>something else to focus</button></div>
      </div>
    );
  }

});

ReactDOM.render(
  <App />,
  document.getElementById('container')
);
