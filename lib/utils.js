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

const snakeCaseKeys = (obj) => {
  const originalKeys = Object.keys(obj);
  return originalKeys
    .map(key => _.snakeCase(key))
    .reduce(
      (carry, key, index) => ({ ...carry, [key]: obj[originalKeys[index]] }),
      {},
    );
};

const transformProjectKeys = project => {
  const { ownerGithubId, ownerLogin } = project;
  const owner = {
    id: ownerGithubId,
    login: ownerLogin
  };
  const snaked = snakeCaseKeys(project);
  delete snaked.owner_github_id;
  delete snaked.owner_login;
  snaked.owner = owner;
  return snaked;
};

module.exports = {
  camelCaseKeys,
  snakeCaseKeys,
  transformProjectKeys
};
