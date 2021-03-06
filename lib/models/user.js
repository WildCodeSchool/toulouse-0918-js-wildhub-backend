const db = require('../db');

const getOne = iid => db.query('SELECT * FROM users where iid = ?', [iid])
  .then(records => (records.length ? records[0] : null));

const getByGitHubId = id => db.query('SELECT * FROM users where id = ?', [id])
  .then(records => (records.length ? records[0] : null));

const getByGitHubLogin = login => db.query('SELECT * FROM users where login = ?', [login])
  .then(records => (records.length ? records[0] : null));

const create = ({ id, login, avatarUrl }) => db.query(
  'INSERT INTO users(id, login, avatar) VALUES(?, ?, ?)', [id, login, avatarUrl],
)
  .then(({ insertId }) => getOne(insertId));

const signupOrGet = user => getByGitHubId(user.id)
  .then(record => (record || create(user)));

module.exports = {
  getOne,
  getByGitHubId,
  getByGitHubLogin,
  create,
  signupOrGet
};
