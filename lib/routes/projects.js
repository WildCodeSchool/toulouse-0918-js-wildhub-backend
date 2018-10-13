const express = require('express');
const projectModel = require('../models/project');
const { camelCaseKeys, snakeCaseKeys } = require('../case');
const { authMw } = require('../jwt');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => projectModel.getAll()
  .then(projects => projects.map(snakeCaseKeys))
  .then(projects => res.json(projects)));

router.post('/', authMw, (req, res) => {
  const projectData = camelCaseKeys(req.body);
  projectModel.createOrToggleActive(projectData)
    .then(snakeCaseKeys)
    .then(data => res.json(data))
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.get('/mine/:githubId', (req, res) => {
  projectModel.getAllByGitHubId(req.params.githubId)
    .then(records => res.json(records));
});

module.exports = router;
