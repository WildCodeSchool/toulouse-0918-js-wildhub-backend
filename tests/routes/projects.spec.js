/* global describe, it */
const assert = require('assert');
const request = require('supertest');
const app = require('../server/app');

describe('Test the projects root path', () => {
  it('It should response the GET method', (done) => {
    request(app).get('/api/projects').then((response) => {
      assert.strictEqual(200, response.statusCode);
      done();
    });
  });
});
