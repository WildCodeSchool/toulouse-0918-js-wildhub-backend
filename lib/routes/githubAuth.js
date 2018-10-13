const express = require('express');
const userModel = require('../models/user');
const { getAccessToken, getUser } = require('../github');

const router = express.Router({ mergeParams: true });

// const passLog = label => obj => {
//   console.log(label, obj);
//   return obj;
// }

router.post('/code', (req, res) => {
  const { code } = req.body;
  getAccessToken(code)
    .then(data => getUser(data.access_token)
      .then(user => userModel.signupOrGet(user))
      .then(
        userRecord => ({
          access_token: data.access_token,
          login: userRecord.login,
          githubId: userRecord.githubId
        }),
      ))
    .then(data => res.json(data))
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

module.exports = router;
