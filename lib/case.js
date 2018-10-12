const _ = require('lodash');

const camelCaseKeys = (obj) => {
  const originalKeys = Object.keys(obj);
  return originalKeys
    .map(key => _.camelCase(key))
    .reduce(
      (carry, key, index) => ({ ...carry, [key]: obj[originalKeys[index]] }),
      {},
    );
};

module.exports = {
  camelCaseKeys,
};
