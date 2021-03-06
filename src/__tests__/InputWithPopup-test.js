var InputWithPopup = require('../InputWithPopup');
var React = require('react/addons');

var {TestUtils} = React.addons;
var {Simulate} = React.addons.TestUtils;

var expect = require('expect');
var emptyFunction = require('../helpers/emptyFunction');

describe('InputWithPopup', function() {

  it('should decorate <input> and the popup with ARIA attrs', function() {
    var ctx = TestUtils.renderIntoDocument(
      <InputWithPopup isOpen={true}><div/></InputWithPopup>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    var menu = TestUtils.findRenderedDOMComponentWithClass(ctx, 'InputWithPopup-popup');

    var inputAttributes = input.getDOMNode().attributes;
    var menuAttributes = menu.getDOMNode().attributes;

    expect(inputAttributes['aria-expanded'].value).toBe('true');
    expect(inputAttributes['aria-haspopup'].value).toBe('true');
    expect(inputAttributes['aria-owns'].value).toBe(menuAttributes['id'].value);
  });

});
