const jwt = require('jsonwebtoken');
const { promisify } = require('util');

const signAsync = promisify(jwt.sign.bind(jwt));
const verifyAsync = promisify(jwt.verify.bind(jwt));

let secret;

const verify = token => verifyAsync(token, secret);

module.exports = {

  sign: payload => signAsync(payload, secret),

  authMw: (req, res, next) => {
    const authHeader = req.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized'
      });
    }
    verify(authHeader.substr(7), (Buffer.from(secret)).toString('base64'))
      .then(() => next());
  },

  setup: s => {
    secret = s;
  }

};
