# react-pick

Accessible autocompletion components (e.g. typeahead inputs, popups, and comboboxes), implemented in React.

Intially derived from Ryan Florence's awesome [react-autocomplete](https://github.com/rackt/react-autocomplete).

## Demos

 - Pick a US state: http://jwilde.me/react-pick/basic/
 - Pick a set of Flickr images: http://jwilde.me/react-pick/flickr/

## Installation & Usage

`npm install react-pick`

You'll need to make sure you're including the `styles.css` file in the root of the npm module in your app somehow. Or write your own, better stylesheet.

### What's inside?

There's a components designed for out-of-the-box usage:

- `<Combobox>` - An input that supports find displaying autocomplete suggestions inline as "type ahead" text, and as a popup menu displayed next to the `<input>`.

And then there's a few components that are helpful for both customizing `<Combobox>` and creating your own autocompletion components:

- `<TypeaheadInput>` - An `<input>` that robustly inserts "type ahead" text beyond the user's input.
- `<InputPopupWrapper>` - Attaches a popup to an `<input>`.
- `<ListPopup>` - A popup for rendering a list of possible completion options.
- `<ListPopupOption>` - The default component for rendering options in `<ListPopup>`.

### How do you use ?

Pretty much much the same way you would the `<input>` component in React, but with an extra `getOptionsForInputValue` method to define what options should be there for autocomplete.

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
      <p>Selection: {this.state.value.selectedValue}</p>
    </div>
  }

});
```

Check out more [examples](https://github.com/hellojwilde/react-pick/tree/master/examples).

