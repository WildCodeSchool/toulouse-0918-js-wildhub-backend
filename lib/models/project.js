const _ = require('lodash');
const db = require('../db');

const indexLanguages = languages => languages.reduce(
  (carry, lang) => ({ ...carry, [lang.iid]: lang.name }),
  {}
);

const getProjectsWithLanguages = queryProjectsPromise => Promise.all([
  queryProjectsPromise,
  db.query('SELECT * FROM languages'),
  db.query('SELECT * FROM projects_languages')
])
  .then(([projects, languages, relationships]) => {
    const indexedLanguages = indexLanguages(languages);
    const relPerProject = _.groupBy(relationships, 'projectId');
    return projects.map(
      proj => {
        const iidStr = proj.iid.toString();
        const languageStat = !relPerProject[iidStr]
          ? {}
          : relPerProject[iidStr].reduce(
            (carry, rel) => {
              const { quantity, languageId } = rel;
              const name = indexedLanguages[languageId.toString()];
              return { ...carry, [name]: quantity };
            }, {}
          );
        return { ...proj, languageStat };
      }
    );
  });

const getAll = () => getProjectsWithLanguages(
  db.query('SELECT * FROM projects')
);

const getAllByGitHubId = githubId => getProjectsWithLanguages(
  db.query(
    'SELECT * FROM projects where ownerGithubId = ?', [githubId]
  )
);

const getByOwnerAndName = (login, name) => getProjectsWithLanguages(
  db.query(
    'SELECT * FROM projects where ownerLogin = ? and name = ?', [login, name]
  )
).then(records => (records ? records[0] : null));

const getOne = id => db.query('SELECT * FROM projects where iid = ?', [id])
  .then(records => (records ? records[0] : null));

const getOneByGitHubId = id => db.query('SELECT * FROM projects where id = ?', [id])
  .then(records => (records ? records[0] : null));

const linkLanguages = (projectId, languageStat) => {
  const langNames = Object.keys(languageStat);
  const langPlaceholder = langNames.map(() => '(?, ?, ?)');
  const langNamesQuoted = langNames.map(l => `'${l}'`);
  const query = `INSERT INTO projects_languages(projectId, languageId, quantity) VALUES ${langPlaceholder}`;
  // console.log(projectId, languageStat, query, langNamesQuoted);
  return db.query(`SELECT iid from languages where name IN (${langNamesQuoted})`)
    .then(records => records.map(({ iid }) => iid))
    .then(languageIds => db.query(
      query,
      Object.values(languageStat).reduce(
        (carry, quantity, index) => carry.concat([projectId, languageIds[index], quantity]), []
      )
    ))
    .then(() => projectId);
};

const create = ({
  id, owner, name, description, homepage, htmlUrl, language, createdAt, updatedAt, languageStat
}) => db.query(
  `INSERT INTO projects (
    id, ownerGithubId, ownerLogin, name, prettyName, description,
    homepage, htmlUrl, language, createdAt, updatedAt
   )
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  [
    id, owner.id, owner.login, name, name, description,
    homepage, htmlUrl, language, createdAt, updatedAt
  ]
)
  .then(({ insertId }) => linkLanguages(insertId, languageStat))
  .then(insertId => getOne(insertId))
  .then(record => ({ ...record, languageStat }));

const createOrGet = project => getOneByGitHubId(project.id)
  .then(record => (record || create(project)));

const toggleActive = record => db.query(
  'UPDATE projects SET active = ? WHERE id = ?',
  [!record.active, record.id]
)
  .then(() => ({ ...record, active: !record.active }));

const createOrToggleActive = project => createOrGet(project)
  .then(toggleActive);

module.exports = {
  getAll,
  getOne,
  getAllByGitHubId,
  getByOwnerAndName,
  create,
  createOrGet,
  createOrToggleActive
};
