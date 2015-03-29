var ExampleConstants = require('../ExampleConstants');
var FlickrInput = require('./FlickrInput');
var React = require('react');

var App = React.createClass({

  getInitialState: function() {
    return {
      value: {
        inputValue: '', 
        value: ''
      },
      selections: []
    };
  },

  handleChange: function(value) {
    this.setState({value});
  },

  handleSelect: function(selection) {
    this.setState({
      selections: this.state.selections.concat(selection)
    });
  },

  renderSelections: function() {
    return this.state.selections.map(function(image, key) {
      return <img key={key} src={image.media.m}/>;
    });
  },

  render: function() {
    return (
      <div>
        <h1>react-pick</h1>
        <h2>Basic Example</h2>
        <p>
          <a href={`${ExampleConstants.publicPath}/flickr`}>
            Demo Source
          </a>
        </p>
        <FlickrInput
          value={this.state.value}
          onChange={this.handleChange}
          onSelect={this.handleSelect}
        />
        <div>
          {this.renderSelections()}
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.body);


