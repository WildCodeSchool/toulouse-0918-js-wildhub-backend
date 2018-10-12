const db = require('../db');

const getOne = id => db.query('SELECT * FROM users where id = ?', [id])
  .then(records => (records ? records[0] : null));

const getByGitHubId = githubId => db.query('SELECT * FROM users where githubId = ?', [githubId])
  .then(records => (records ? records[0] : null));

const create = ({ id, login, avatar_url }) => db.query(
  'INSERT INTO users(githubId, githubLogin, avatar) VALUES(?, ?, ?)', [id, login, avatar_url],
)
  .then(({ insertId }) => getOne(insertId));

const signupOrGet = user => getByGitHubId(user.id)
  .then(record => (record || create(user)));

module.exports = {
  getOne,
  getByGitHubId,
  create,
  signupOrGet,
};
