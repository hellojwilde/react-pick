function getMockFunction(returnValue) {
  var fn = function(...args) {
    fn.calls.push(args);
    return returnValue;
  };

  fn.calls = [];
  return fn;
}

module.exports = getMockFunction;
