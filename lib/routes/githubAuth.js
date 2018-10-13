const express = require('express');
const userModel = require('../models/user');
const { getAccessToken, getUser } = require('../github');
const { camelCaseKeys } = require('../case');
const { sign } = require('../jwt');

const router = express.Router({ mergeParams: true });

router.post('/code', (req, res) => {
  const { code } = req.body;
  getAccessToken(code)
    .then(data => getUser(data.access_token)
      .then(user => userModel.signupOrGet(camelCaseKeys(user)))
      .then(
        userRecord => sign({
          accessToken: data.access_token,
          login: userRecord.login,
          githubId: userRecord.githubId
        })
      ))
    .then(token => res.json({ token }))
    .catch((err) => {
      const statusCode = err.message === 'Request failed with status code 401'
        ? 401 : 500;
      res.status(statusCode).json({ error: err.message });
    });
});

module.exports = router;
