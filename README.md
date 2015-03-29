# react-pick

Flexible autocompletion widgets, implemented in React.

Intially derived from Ryan Florence's awesome [react-autocomplete](https://github.com/rackt/react-autocomplete).

## Demos

 - Pick a US state: http://jwilde.me/react-pick/basic/
 - Pick a set of Flickr images: http://jwilde.me/react-pick/flickr/

## Installation

`npm install react-pick`

You'll need to make sure you're including the `styles.css` file in the root of the npm module in your app somehow. Or write a better stylesheet for your own site.

## Usage

The same way you would use an input component in React.

```js
var React = require('react');
var {Combobox} = require('react-pick');

var AWESOME_PEOPLE = [
  'Ryan Florence',
  'Pete Hunt', 
  'Jonathan Wilde'
];

var MyAppWithACombobox = React.createClass({

  getInitialState: function() {
    return {value: {selectedValue: null, inputValue: ''}};
  },

  getOptionsForInputValue: function(inputValue, callback) {
    inputValue = inputValue.toLowerCase();

    callback(
      AWESOME_PEOPLE
        .map((person) => person.toLowerCase())
        .filter((person) => person.indexOf(inputValue) === 0)
    );
  },

  handleChange: function(newValue) {
    this.setState({value: newValue});
  },

  render: function() {
    <div className="app">
      <Combobox
        getOptionsForInputValue={this.getOptionsForInputValue}
        onChange={this.handleChange}
        value={this.state.value}
      />
      <p>Selection: {this.state.value.selectedValue}</p>
    </div>
  }

});
```

Check out more [examples](https://github.com/hellojwilde/react-pick/tree/master/examples).

