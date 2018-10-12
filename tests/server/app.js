// app.js
const express = require('express');

const app = express();
const { db, router } = require('../../lib');
const dbSettings = require('../../../db-settings');
db.setup(dbSettings);


app.use('/api', router);
module.exports = app;
