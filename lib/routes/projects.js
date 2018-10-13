const express = require('express');
const projectModel = require('../models/project');
const { camelCaseKeys, snakeCaseKeys } = require('../case');
const { authMw } = require('../jwt');
const logger = require('../logger');

const router = express.Router({ mergeParams: true });

const transformKeys = project => {
  const { ownerGithubId, ownerLogin } = project;
  const owner = {
    id: ownerGithubId,
    login: ownerLogin
  };
  const snaked = snakeCaseKeys(project);
  delete snaked.owner_github_id;
  delete snaked.owner_id;
  snaked.owner = owner;
  return snaked;
};

router.get('/', (req, res) => projectModel.getAll()
  .then(projects => projects.map(transformKeys))
  .then(projects => res.json(projects)));

router.post('/', authMw, (req, res) => {
  if (!req.body || !req.body.owner) {
    return res.status(400).json({
      error: 'body must exist and have an owner property'
    });
  }
  const { owner: { id } } = req.body;
  if (id !== req.user.githubId) {
    return res.status(403).json({
      error: "Forbidden: your GitHub account id doesn't match the project owner's id"
    });
  }
  const projectData = camelCaseKeys(req.body);
  return projectModel.createOrToggleActive(projectData)
    .then(snakeCaseKeys)
    .then(data => res.json(data))
    .catch((err) => {
      logger.error(err);
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
