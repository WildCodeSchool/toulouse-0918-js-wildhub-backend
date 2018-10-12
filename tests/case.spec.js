/* global describe, it */
const assert = require('assert');
const { camelCaseKeys } = require('../lib/case');

describe('Case transform utilities', () => {
  it('camelCaseKeys', () => {
    assert.deepStrictEqual({
      htmlUrl: 'https://example.com',
      githubOwnerId: 1,
    }, camelCaseKeys({
      html_url: 'https://example.com',
      github_owner_id: 1,
    }));
  });
});
