// app.js
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const { db, router } = require('../../lib');
const dbSettings = require('./db-settings');
db.setup(dbSettings);

app.use('/api', router);
module.exports = app;
