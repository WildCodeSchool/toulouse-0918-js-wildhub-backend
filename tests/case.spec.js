/* global describe, it */
const assert = require('assert');
const { camelCaseKeys, snakeCaseKeys } = require('../lib/case');

describe('Case transform utilities', () => {
  it('test camelCaseKeys', () => {
    assert.deepStrictEqual({
      htmlUrl: 'https://example.com',
      githubOwnerId: 1,
    }, camelCaseKeys({
      html_url: 'https://example.com',
      github_owner_id: 1,
    }));
  });
  it('tests snakeCaseKeys', () => {
    assert.deepStrictEqual({
      html_url: 'https://example.com',
      github_owner_id: 1,
    }, snakeCaseKeys({
      htmlUrl: 'https://example.com',
      githubOwnerId: 1,
    }));
  });
});
