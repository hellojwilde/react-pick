var ExampleConstants = require('../ExampleConstants');
var FlickrInput = require('./FlickrInput');
var React = require('react');

var App = React.createClass({

  getInitialState: function() {
    return {
      value: '',
      completions: []
    };
  },

  handleChange: function(value) {
    this.setState({value});
  },

  handleComplete: function(selection) {
    this.setState({
      completions: this.state.completions.concat(selection)
    });
  },

  renderCompletions: function() {
    return this.state.completions.map(function(image, key) {
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
          onComplete={this.handleComplete}
        />
        <div>
          {this.renderCompletions()}
        </div>
      </div>
    );
  }
});

React.render(<App/>, document.body);


