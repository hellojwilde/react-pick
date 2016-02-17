var React = require('react');
var TypeaheadInput = require('../TypeaheadInput');
var TestUtils = require('react-addons-test-utils');
var Simulate = TestUtils.Simulate;

var expect = require('expect');
var emptyFunction = require('../helpers/emptyFunction');

const KEY_BACKSPACE = 8;

var TypeaheadInputTestWrapper = React.createClass({

  getDefaultProps: function() {
    return {
      initialValue: '',
      onChange: emptyFunction
    };
  },

  getInitialState: function() {
    return {
      value: this.props.initialValue 
    };
  },

  handleChange: function(event) {
    this.setState({value: event.target.value});
    this.props.onChange(event);
  },

  render: function() {
    var {...otherProps} = this.props;

    return (
      <TypeaheadInput
        {...otherProps}
        value={this.state.value}
        onChange={this.handleChange}
      />
    );
  }

});

describe('TypeaheadInput', function() {

  it('shows some text, and supports typing', function() {
    var ctx = TestUtils.renderIntoDocument(
      <TypeaheadInputTestWrapper initialValue="hello"/>
    );

    // Ensure that the text that we provided actually shows up in the input
    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    expect(input.value).toBe('hello');

    // Ensure that changes that we supply actually show up in the input
    Simulate.change(input, {target: {value: 'hello!'}});
    Simulate.keyDown(input, {key: '!'});
    Simulate.keyUp(input, {key: '!'});
    expect(input.value).toBe('hello!');
  });

  it('shows typeahead text when typing forward', function() {
    var ctx = TestUtils.renderIntoDocument(
      <TypeaheadInputTestWrapper typeaheadValue="California"/>
    );

    // Ensure that there's no typehead
    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    expect(input.value).toBe('');

    // Ensure that the typeahead shows up case-insensitively and is selected
    Simulate.change(input, {target: {value: 'c'}});
    Simulate.keyDown(input, {key: 'c'});
    Simulate.keyUp(input, {key: 'c'});
    expect(input.value).toBe('california');
  });

  it('omits the typehead if the completion text does not match', function() {
    var ctx = TestUtils.renderIntoDocument(
      <TypeaheadInputTestWrapper 
        typeaheadValue="California"
        initialValue="h"
      />
    );

    // Ensure that there's no typehead
    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    expect(input.value).toBe('h');

    // Ensure that there's still no typeahead
    Simulate.change(input, {target: {value: 'hi'}});
    Simulate.keyDown(input, {key: 'i'});
    Simulate.keyUp(input, {key: 'i'});
    expect(input.value).toBe('hi');
  });

});
