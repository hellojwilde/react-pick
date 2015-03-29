function getARIADescendantId(listId, index) {
  return index && (listId + '-' + index);
}

module.exports = getARIADescendantId;