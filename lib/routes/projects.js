const express = require('express');
const projectModel = require('../models/project');
const { camelCaseKeys, snakeCaseKeys } = require('../case');
const { authMw } = require('../jwt');

const router = express.Router({ mergeParams: true });

router.get('/', (req, res) => projectModel.getAll()
  .then(projects => projects.map(snakeCaseKeys))
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
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
