'use strict';

const OAuth2 = require('googleapis').auth.OAuth2;

module.exports = function(config, access_token) {
  var client = new OAuth2(
    config.clientId, config.secret, config.returnUrl
  );
  client.setCredentialsCustom = function(access_token) {
    this.setCredentials({access_token});
  }

  if (access_token) {
    client.setCredentialsCustom(access_token);
  }

  return client;
};
