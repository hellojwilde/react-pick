var Combobox = require('../Combobox');
var React = require('react/addons');

var {TestUtils} = React.addons;
var {Simulate} = React.addons.TestUtils;

var expect = require('expect');
var emptyFunction = require('../helpers/emptyFunction');

describe('Combobox', function() {
  it('should propagate props like placeholder to the <input>', function() {
    var ctx = TestUtils.renderIntoDocument(
      <Combobox 
        placeholder="magic"
        getOptionsForInputValue={emptyFunction}
        onChange={emptyFunction}
        value={null}
      />
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    var inputAttributes = input.getDOMNode().attributes;

    expect(inputAttributes['placeholder'].value).toBe('magic');
  });
});