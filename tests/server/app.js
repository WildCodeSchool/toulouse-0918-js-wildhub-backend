const express = require('express');
const bodyParser = require('body-parser');
const { db, router } = require('../../lib');
const dbSettings = require('./db-settings');

const app = express();
app.use(bodyParser.json());
db.setup(dbSettings);

app.use('/api', router);
module.exports = app;
