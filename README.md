# react-pick-2

[![Build Status](https://travis-ci.org/hellojwilde/react-pick.svg?branch=master)](https://travis-ci.org/hellojwilde/react-pick)

Accessible autocompletion components (e.g. typeahead inputs, popups, and comboboxes), implemented in React.

Intially derived from Ryan Florence's awesome [react-autocomplete](https://github.com/rackt/react-autocomplete).

## Demos

 - Pick a US state: [http://jwilde.me/react-pick/basic/](http://jwilde.me/react-pick/basic/)
 - Pick a set of Flickr images: [http://jwilde.me/react-pick/flickr/](http://jwilde.me/react-pick/flickr/)

## Installation & Usage

`npm install react-pick`

You'll need to make sure you're including the `styles.css` file in the root of the npm module in your app somehow. Or write your own, better stylesheet.

### What's inside?

For out-of-the-box usage:

- [`<Combobox>`](https://github.com/hellojwilde/react-pick/blob/master/src/Combobox.js) - Supports find displaying asynchronous autocomplete suggestions inline as "type ahead" text, as a popup menu, and as both at once. Supports keyboard navigation, and seeks to be WAI-ARIA compliant.

For customizing `<Combobox>` and creating your own components:

- [`<TypeaheadInput>`](https://github.com/hellojwilde/react-pick/blob/master/src/TypeaheadInput.js) - An `<input>` that robustly inserts "type ahead" text.
- [`<InputWithPopup>`](https://github.com/hellojwilde/react-pick/blob/master/src/InputWithPopup.js) - Attaches a popup to an `<input>`.
- [`<List>`](https://github.com/hellojwilde/react-pick/blob/master/src/List.js) - A popup for rendering a list of possible completion options.
- [`<ListOption>`](https://github.com/hellojwilde/react-pick/blob/master/src/ListOption.js) - The default component for rendering options in `<ListPopup>`.

### How do you use `<Combobox>`?

Pretty much the same way you would the `<input>` component in React, but with an extra `getOptionsForInputValue` property to fetch autocompletion options.

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
    return {value: null};
  },

  getOptionsForInputValue: function(inputValue) {
    return new Promise(function(resolve, reject) {
      inputValue = inputValue.toLowerCase();

      resolve(
        AWESOME_PEOPLE
          .map((person) => person.toLowerCase())
          .filter((person) => person.indexOf(inputValue) === 0)
      );
    });
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
      <p>Selection: {this.state.value}</p>
    </div>
  }

});
```

Check out more [examples](https://github.com/hellojwilde/react-pick/tree/master/examples).

### What sorts of components can you build with it?

- [react-pick-datetime](https://github.com/hellojwilde/react-pick-datetime) - Components for selecting dates and times.
