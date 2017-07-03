'use strict';

const GoogleAuth = require('googleapis').auth.OAuth2;

const CONSTANTS = require('./constants');
const p = require('../../privatory')();

const PROVIDER = 'google';

class GoogleAuthie {
  constructor(config, deferrari) {
    if (!config) throw new Error('Config for google auth missing.');
    if (!config.clientId) throw new Error('Client id missing for google auth.');
    if (!config.secret) throw new Error('Client secret is missing for google auth.');

    p(this).deferrari = deferrari;
    p(this).auth = new GoogleAuth(config.clientId, config.secret, config.returnUrl);
  }

  getToken(code) {
    return p(this).deferrari.deferUntil(CONSTANTS.ROOT.SEQUELIZE_SYNC)
    .then(models => {
      return new Promise((resolve, reject) => {
        p(this).auth.getToken(
          code, 
          (err, result) => {
            if (err) return reject(err);
            let token = result.access_token;
            delete result.access_token;

            models.AuthToken.saveToken(token, PROVIDER, result)
            .then(authToken => resolve(authToken))
            .catch(err => reject(err));
          }
        );
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
