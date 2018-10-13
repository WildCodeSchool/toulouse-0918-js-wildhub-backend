const fs = require('fs');
const path = require('path');
const Promise = require('bluebird');
const dbSettings = require('./db-settings');
const { db } = require('../../lib');

const sqlPath = path.resolve(__dirname, '../../sql');
const insertLanguagesSql = fs.readFileSync(`${sqlPath}/languages.sql`).toString();
const tables = ['projects_languages', 'projects', 'languages', 'users'];

db.setup(dbSettings);

const extractTableNames = rows => rows.map(r => r.table_name);

const clear = () => db.query(`SELECT table_name FROM information_schema.tables where table_schema='${dbSettings.database}'`)
  .then(extractTableNames)
  .then(() => Promise.map(
    tables,
    table => db.query(`DELETE FROM ${table} WHERE 1`)
      .then(() => db.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`))
      .catch(() => {})
  ));

const insertLanguages = () => db.query(insertLanguagesSql);

const insertUser = () => db.query(
  'INSERT INTO users(githubId, login, avatar) VALUES (?, ?, ?)',
  [5678, 'www5678', 'https://example.com/foo.png']
)
  .then(({ insertId }) => insertId);

module.exports = {
  db,
  clear,
  insertLanguages,
  insertUser
};
