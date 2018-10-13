const express = require('express');
const bodyParser = require('body-parser');
const { db, api } = require('../../lib');
const dbSettings = require('./db-settings');

const app = express();
app.use(bodyParser.json());
db.setup(dbSettings);

app.use('/api', api);
module.exports = app;
