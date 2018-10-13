/* global describe, it, beforeEach */
const assert = require('assert');
const request = require('supertest');
const { clear, insertLanguages, insertUser } = require('../server/db-utils');
const { camelCaseKeys } = require('../../lib/case');
const app = require('../server/app');

const dummyProject = {
  id: 12345,
  owner: { id: 9876, login: 'www5678' },
  name: 'dummy-project',
  description: 'for tests purposes',
  homepage: 'https://example.com',
  html_url: 'https://github.com/www5678/dummy-project',
  language: 'JavaScript',
  language_stat: {
    JavaScript: 510,
    HTML: 50,
    CSS: 210
  }
};

describe('Test the projects root path', () => {
  beforeEach(() => clear().then(insertLanguages));

  it('It should test the GET method', (done) => {
    request(app).get('/api/projects').then((response) => {
      assert.strictEqual(200, response.statusCode);
      done();
    });
  });
  it('It should test the POST method', (done) => {
    insertUser()
      .then(
        () => request(app).post('/api/projects')
          .send(dummyProject)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
      )
      .then((response) => {
        assert.strictEqual(200, response.statusCode);
        const expected = { ...dummyProject };
        delete expected.owner;
        expected.id = 1;
        expected.github_id = 12345;
        expected.active = true;
        expected.owner_github_id = 9876;
        expected.owner_login = 'www5678';
        expected.pretty_name = 'dummy-project';
        assert.deepStrictEqual({ id: 1, ...expected }, response.body);
        done();
      });
  });
});
