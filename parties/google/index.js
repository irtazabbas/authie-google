'use strict';

const GoogleAuth = require('googleapis').auth.OAuth2;

const CONSTANTS = require('./constants');
const GARAGE = require('../../garage-de-ferraris');
const p = require('../../privatory')();

const PROVIDER = 'google';

class GoogleAuthie {
  constructor(config) {
    if (!config) throw new Error('Config for google auth missing.');
    if (!config.clientId) throw new Error('Client id missing for google auth.');
    if (!config.secret) throw new Error('Client secret is missing for google auth.');

    p(this).auth = new GoogleAuth(config.clientId, config.secret, config.returnUrl);
  }

  getToken(code) {
    return GARAGE.DB_SYNC.DEF.deferUntil(GARAGE.DB_SYNC.KEY)
    .then(models => {
      return new Promise((resolve, reject) => {
        p(this).auth.getToken(code, 
        (err, result) => {
          if (err) return reject(err);
          let token = result.access_token;
          delete result.access_token;

          models.AuthToken.saveToken(token, PROVIDER, result)
          .then(authToken => {
            resolve(tokens);
          })
          .catch(err => {
            reject(err);
          });
        });
      });
    });
  }

  getAuthUrl(scopes) {
    scopes = scopes && scopes.length ? scopes : [CONSTANTS.SCOPES.PLUS];
    return new Promise((resolve, reject) => {
      resolve(p(this).auth.generateAuthUrl({
        scope: scopes,
        access_type: 'offline'
      }));
    });
  }
}

module.exports = (config, deferrari) => new GoogleAuthie(config, deferrari);
