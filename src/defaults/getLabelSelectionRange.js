function getLabelSelectionRange(inputValue, label) {
  inputValue = inputValue.toLowerCase();
  label = label.toLowerCase();

  if (inputValue === '' || inputValue === label) {
    return null;
  } else if (label.indexOf(inputValue) === -1) {
    return null;
  } else {
    return {start: inputValue.length, end: label.length};
  }
}

module.exports = getLabelSelectionRange;