const express = require('express');
const userModel = require('../models/user');
const projectModel = require('../models/project');
const { snakeCaseKeys, transformProjectKeys } = require('../utils');
const { authMw } = require('../jwt');

const router = express.Router({ mergeParams: true });

router.get('/', authMw, (req, res) => userModel.getAll()
  .then(records => records.map(snakeCaseKeys))
  .then(records => res.json(records)));

router.get('/:login', authMw,
  ({ params }, res) => userModel.getByGitHubLogin(params.login)
    .then(record => res.json(snakeCaseKeys(record))));

router.get('/self/projects', authMw, (req, res) => {
  projectModel.getAllByGitHubId(req.user.githubId)
    .then(records => records.map(transformProjectKeys))
    .then(records => res.json(records));
});

module.exports = router;
