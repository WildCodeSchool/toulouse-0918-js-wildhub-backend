/* global describe, it, beforeEach */
const assert = require('assert');
const request = require('supertest');
const jwt = require('jsonwebtoken');
const { clear, insertLanguages, insertUser } = require('../server/db-utils');

const app = require('../server/app');

const authToken = jwt.sign({
  accessToken: process.env.GITHUB_TOKEN,
  login: 'bhubr',
  githubId: 15270070
}, 'secret');

const dummyProjectBase = {
  id: 12345,
  // owner: { id: 15270070, login: 'bhubr' },
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

describe('Test the projects routes', () => {
  beforeEach(() => clear().then(insertLanguages));

  it('It should test the GET (all) method', () => {
    request(app).get('/api/projects').then((response) => {
      assert.strictEqual(200, response.statusCode);
    });
  });

  it('It should test the POST method with correct payload', () => {
    const dummyProject = {
      ...dummyProjectBase,
      owner: { id: 15270070, login: 'bhubr' }
    };
    insertUser()
      .then(
        () => request(app).post('/api/projects')
          .send(dummyProject)
          // Put a JWT in env
          .set('Authorization', `Bearer ${authToken}`)
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
      });
  });

  it('It should test the POST method with owner id mismatch', () => {
    const dummyProject = {
      ...dummyProjectBase,
      owner: { id: 5678, login: 'whatever' }
    };
    insertUser()
      .then(
        () => request(app).post('/api/projects')
          .send(dummyProject)
          // Put a JWT in env
          .set('Authorization', `Bearer ${authToken}`)
          .set('Content-Type', 'application/json')
          .set('Accept', 'application/json')
      )
      .then((response) => {
        assert.strictEqual(403, response.statusCode);
        assert.strictEqual(
          "Forbidden: your GitHub account id doesn't match the project owner's id", response.body.error
        );
      });
  });
});
