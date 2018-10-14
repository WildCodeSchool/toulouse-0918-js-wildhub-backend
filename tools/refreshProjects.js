const axios = require('axios');
const Promise = require('bluebird');
const { db } = require('../lib');

const githubApiUrl = 'https://api.github.com';

const dateToMysql = date => date.replace('T', ' ').substr(0, 19);

const passLog = label => obj => {
  console.log(label, obj);
  return obj;
};

const refreshOneRecord = ({ id, name, ownerLogin: login }) => axios.get(
  `${githubApiUrl}/repos/${login}/${name}`
)
  .then(res => res.data)
  .then(passLog(`before updating ${id} ${login}/${name}`))
  .then(project => db.query(
    'UPDATE projects SET createdAt = ?, updatedAt = ? WHERE id = ?',
    [dateToMysql(project.created_at), dateToMysql(project.updated_at), id]
  ))
  .then(passLog(`after updating ${id} ${login}/${name}`));

const refreshAllRecords = records => Promise.map(records, refreshOneRecord);

const refreshProjects = settings => {
  db.setup(settings);
  return db.query('SELECT id, name, ownerLogin FROM projects')
    .then(passLog('after getting all projects'))
    .then(refreshAllRecords);
};

module.exports = refreshProjects;
