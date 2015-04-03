var guid = 0;

function getUniqueId(namespace) {
  return namespace + '-' + (++guid);
};

module.exports = getUniqueId;