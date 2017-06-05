'use strict';

const GoogleAuth = require('googleapis').auth.OAuth2;
const CONSTANTS = require('./constants');

class GoogleAuthie {
  constructor(config) {
    if (!config) throw new Error('Config for google auth missing.');
    if (!config.clientId) throw new Error('Client id missing for google auth.');
    if (!config.secret) throw new Error('Client secret is missing for google auth.');

    this.auth = new GoogleAuth(config.clientId, config.secret, config.returnUrl);
  }

  getToken(code) {
    return new Promise((resolve, reject) => {
      this.auth.getToken(code, (err, tokens) => {
        if (err) return reject(err);
        // TODO save to db.
        resolve(tokens);
      });
    });
  }

  getAuthUrl(scopes) {
    scopes = scopes && scopes.length ? scopes : [CONSTANTS.SCOPES.PLUS];
    return new Promise((resolve, reject) => {
      resolve(this.auth.generateAuthUrl({scope: scopes}));
    });
  }
}

module.exports = (config) => new GoogleAuthie(config);
