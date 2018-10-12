// const userModel = require('./userModel');
// const projectModel = require('./projectModel');


const github = require('./github');
const router = require('./routes');
const db = require('./db');

// const settings = require('../../settings');

// github.setup(settings);

module.exports = {
  db,
  github,
  router,
};
