const _ = require('lodash');
const db = require('../db');

const dateToMysql = date => date.replace('T', ' ').substr(0, 19);

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
  db.query('SELECT * FROM projects WHERE active = 1 ORDER BY updatedAt DESC')
);
const getFromProjectIds = records => {
  if (records.length === 0) {
    return [];
  }
  const projectIds = records.map(({ projectId }) => projectId);
  return getProjectsWithLanguages(
    db.query(`SELECT * FROM projects WHERE iid IN (${projectIds}) AND active = 1 ORDER BY updatedAt DESC`)
  );
};

const getByLanguageId = languageId => db.query(
  'SELECT projectId FROM projects_languages WHERE languageId = ?', [languageId]
)
  .then(getFromProjectIds);


const getByLanguage = languageName => db.query(
  'SELECT * FROM languages WHERE name = ?', [languageName]
).then(records => (!records.length
  ? []
  : getByLanguageId(records[0].iid)));

const getAllByGitHubId = githubId => getProjectsWithLanguages(
  db.query(
    'SELECT * FROM projects WHERE ownerGithubId = ? AND active = 1 ORDER BY updatedAt DESC', [githubId]
  )
);

const getAllByOwner = login => getProjectsWithLanguages(
  db.query(
    'SELECT * FROM projects WHERE ownerLogin = ? AND active = 1 ORDER BY updatedAt DESC', [login]
  )
);

const getByOwnerAndName = (login, name) => getProjectsWithLanguages(
  db.query(
    'SELECT * FROM projects where ownerLogin = ? and name = ? AND active = 1', [login, name]
  )
).then(records => (records.length ? records[0] : null));

const getOne = id => db.query('SELECT * FROM projects where iid = ? AND active = 1', [id])
  .then(records => (records.length ? records[0] : null));

const getOneByGitHubId = id => db.query('SELECT * FROM projects where id = ? AND active = 1', [id])
  .then(records => (records.length ? records[0] : null));

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
    homepage, htmlUrl, language, dateToMysql(createdAt), dateToMysql(updatedAt)
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
  getByLanguage,
  getAllByOwner,
  create,
  createOrGet,
  createOrToggleActive
};
