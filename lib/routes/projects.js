const express = require('express');
const projectModel = require('../models/project');

const router = express.Router({ mergeParams: true });

router.post('/', (req, res) => {
  projectModel.createOrToggleActive(req.body)
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
