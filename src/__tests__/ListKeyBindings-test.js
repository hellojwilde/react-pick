var ListKeyBindings = require('../ListKeyBindings');
var React = require('react/addons');

var {TestUtils} = React.addons;
var {Simulate} = React.addons.TestUtils;

var expect = require('expect');
var emptyFunction = require('../helpers/emptyFunction');
var getMockFunction = require('../helpers/getMockFunction');

const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_RETURN = 13;
const KEY_ESC = 27;

describe('ListKeyBindings', function() {
  it('requests first item on down if none selected', function() {
    var onChangeMock = getMockFunction();
    var ctx = TestUtils.renderIntoDocument(
      <ListKeyBindings 
        optionsLength={3} 
        focusedIndex={null} 
        onCancel={emptyFunction}
        onChange={onChangeMock}
        onComplete={emptyFunction}>
        <input/>
      </ListKeyBindings>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    Simulate.keyDown(input, {keyCode: KEY_DOWN});

    expect(onChangeMock.calls.length).toBe(1);
    expect(onChangeMock.calls[0]).toEqual([0]);
  });

  it('requests next item on down', function() {
    var onChangeMock = getMockFunction();
    var ctx = TestUtils.renderIntoDocument(
      <ListKeyBindings 
        optionsLength={3} 
        focusedIndex={1} 
        onCancel={emptyFunction}
        onChange={onChangeMock}
        onComplete={emptyFunction}>
        <input/>
      </ListKeyBindings>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    Simulate.keyDown(input, {keyCode: KEY_DOWN});

    expect(onChangeMock.calls.length).toBe(1);
    expect(onChangeMock.calls[0]).toEqual([2]);
  });

  it('requests last item on up if none selected', function() {
    var onChangeMock = getMockFunction();
    var ctx = TestUtils.renderIntoDocument(
      <ListKeyBindings 
        optionsLength={3} 
        focusedIndex={null} 
        onCancel={emptyFunction}
        onChange={onChangeMock}
        onComplete={emptyFunction}>
        <input/>
      </ListKeyBindings>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    Simulate.keyDown(input, {keyCode: KEY_UP});

    expect(onChangeMock.calls.length).toBe(1);
    expect(onChangeMock.calls[0]).toEqual([2]);
  });

  it('requests previous item on up', function() {
    var onChangeMock = getMockFunction();
    var ctx = TestUtils.renderIntoDocument(
      <ListKeyBindings 
        optionsLength={3} 
        focusedIndex={1} 
        onCancel={emptyFunction}
        onChange={onChangeMock}
        onComplete={emptyFunction}>
        <input/>
      </ListKeyBindings>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    Simulate.keyDown(input, {keyCode: KEY_UP});

    expect(onChangeMock.calls.length).toBe(1);
    expect(onChangeMock.calls[0]).toEqual([0]);
  });

  it('completes current item on return', function() {
    var onCompleteMock = getMockFunction();
    var ctx = TestUtils.renderIntoDocument(
      <ListKeyBindings 
        optionsLength={3} 
        focusedIndex={2} 
        onCancel={emptyFunction}
        onChange={emptyFunction}
        onComplete={onCompleteMock}>
        <input/>
      </ListKeyBindings>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    Simulate.keyDown(input, {keyCode: KEY_RETURN});

    expect(onCompleteMock.calls.length).toBe(1);
    expect(onCompleteMock.calls[0]).toEqual([2]);
  });

  it('cancels on escape', function() {
    var onCancelMock = getMockFunction();
    var ctx = TestUtils.renderIntoDocument(
      <ListKeyBindings 
        optionsLength={3} 
        focusedIndex={2} 
        onCancel={onCancelMock}
        onChange={emptyFunction}
        onComplete={emptyFunction}>
        <input/>
      </ListKeyBindings>
    );

    var input = TestUtils.findRenderedDOMComponentWithTag(ctx, 'input');
    Simulate.keyDown(input, {keyCode: KEY_ESC});

    expect(onCancelMock.calls.length).toBe(1);
  });
});
