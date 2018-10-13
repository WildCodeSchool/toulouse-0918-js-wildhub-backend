const api = require('./routes');
const db = require('./db');
const github = require('./github');
const jwt = require('./jwt');

module.exports = {
  api,
  db,
  github,
  jwt
};
