const express = require('express');
const bodyParser = require('body-parser');
const { db, api, jwt } = require('../../lib');
const dbSettings = require('./db-settings');

const app = express();
app.use(bodyParser.json());
db.setup(dbSettings);
jwt.setup('secret');

app.use('/api', api);
module.exports = app;
