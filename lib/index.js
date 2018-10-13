const github = require('./github');
const api = require('./routes');
const db = require('./db');

module.exports = {
  db,
  github,
  api
};
