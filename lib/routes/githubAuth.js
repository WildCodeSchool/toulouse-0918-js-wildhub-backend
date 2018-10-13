const express = require('express');
const userModel = require('../models/user');
const { getAccessToken, getUser } = require('../github');
const { sign } = require('../jwt');

const router = express.Router({ mergeParams: true });

router.post('/code', (req, res) => {
  const { code } = req.body;
  getAccessToken(code)
    .then(data => getUser(data.access_token)
      .then(user => userModel.signupOrGet(user))
      .then(
        userRecord => sign({
          accessToken: data.access_token,
          login: userRecord.login,
          githubId: userRecord.githubId
        })
      ))
    .then(token => res.json({ token }))
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
