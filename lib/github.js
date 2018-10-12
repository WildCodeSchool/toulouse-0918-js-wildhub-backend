const qs = require('querystring');
const axios = require('axios');

module.exports = {

  /**
   * Get GitHub access token from code that was obtained on authorization
   */
  getAccessToken: (code) => {
    const { clientId, clientSecret, redirectUri } = this;
    return axios.post('https://github.com/login/oauth/access_token', {
      client_id: clientId, client_secret: clientSecret, redirect_uri: redirectUri, code,
    })
      .then(response => response.data)
      .then(data => qs.parse(data));
  },

  /**
   * Get user information based on the access token
   */
  getUser: accessToken => axios.get('https://api.github.com/user', {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
    .then(response => response.data),

  /**
   * Store GitHub OAuth app settings (from a JSON settings file)
   */
  setup: ({ clientId, clientSecret, redirectUri }) => {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.redirectUri = redirectUri;
  },
};
