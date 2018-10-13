const db = require('../db');

const getAll = () => db.query('SELECT * FROM projects');

const getOne = id => db.query('SELECT * FROM projects where id = ?', [id])
  .then(records => (records ? records[0] : null));

const getOneByGitHubId = id => db.query('SELECT * FROM projects where githubId = ?', [id])
  .then(records => (records ? records[0] : null));

const getAllByGitHubId = githubId => db.query('SELECT * FROM projects where ownerGithubId = ?', [githubId]);

const linkLanguages = (projectId, languageStat) => {
  const langNames = Object.keys(languageStat);
  const langPlaceholder = langNames.map(() => '(?, ?, ?)');
  const langNamesQuoted = langNames.map(l => `'${l}'`);
  const query = `INSERT INTO projects_languages(projectId, languageId, quantity) VALUES ${langPlaceholder}`;
  return db.query(`SELECT id from languages where name IN (${langNamesQuoted})`)
    .then(records => records.map(({ id }) => id))
    .then(languageIds => db.query(
      query,
      Object.values(languageStat).reduce(
        (carry, quantity, index) => carry.concat([projectId, languageIds[index], quantity]), []
      )
    ))
    .then(() => projectId);
};

const create = ({
  id, owner, name, description, homepage, htmlUrl, language, languageStat
}) => db.query(
  'INSERT INTO projects(githubId, ownerGithubId, ownerLogin, name, prettyName, description, homepage, htmlUrl, language) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
  [id, owner.id, owner.login, name, name, description, homepage, htmlUrl, language],
)
  .then(({ insertId }) => linkLanguages(insertId, languageStat))
  .then(insertId => getOne(insertId))
  .then(record => ({ ...record, languageStat }));

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
  getAll,
  getOne,
  getAllByGitHubId,
  create,
  createOrGet,
  createOrToggleActive
};
