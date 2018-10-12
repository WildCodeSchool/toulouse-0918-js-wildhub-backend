const db = require('../db');

const getOne = id => db.query('SELECT * FROM projects where id = ?', [id])
  .then(records => (records ? records[0] : null));

const getOneByGitHubId = id => db.query('SELECT * FROM projects where githubId = ?', [id])
  .then(records => (records ? records[0] : null));


const getAllByGitHubId = githubId => db.query('SELECT * FROM projects where ownerGithubId = ?', [githubId]);

const create = ({
  id, owner, name, description, homepage, html_url, language,
}) => db.query(
  'INSERT INTO projects(githubId, ownerGithubId, name, slug, description, homepage, htmlUrl, language) VALUES(?, ?, ?, ?, ?, ?, ?, ?)',
  [id, owner.id, name, name, description, homepage, html_url, language],
)
  .then(({ insertId }) => getOne(insertId));

const createOrGet = project => getOneByGitHubId(project.id)
  .then(record => (record || create(project)));

const toggleActive = record => db.query(
  'UPDATE projects SET active = ? WHERE githubId = ?',
  [!record.active, record.githubId],
)
  .then(() => ({ ...record, active: !record.active }));

const createOrToggleActive = project => createOrGet(project)
  .then(toggleActive);

module.exports = {
  getOne,
  getAllByGitHubId,
  create,
  createOrGet,
  createOrToggleActive,
};
