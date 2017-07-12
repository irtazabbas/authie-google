'use strict';

const google = require('googleapis');

const authClient = require('./auth-client');
const CONSTANTS = require('./constants');
const p = require('../../privatory')();

const PROVIDER = 'google';

class GoogleAuthie {
  constructor(config, deferrari) {
    if (!config) throw new Error('Config for google auth missing.');
    if (!config.clientId) throw new Error('Client id missing for google auth.');
    if (!config.secret) throw new Error('Client secret is missing for google auth.');

    p(this).api = google;
    p(this).config = config;
    p(this).deferrari = deferrari;
    p(this).auth = authClient(config);
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
            .then(authToken => {
              this.getAndSaveProfile(authToken.id);
              resolve(authToken);
            })
            .catch(err => reject(err));
          }
        );
      });
    });
  }

  getProfile(authTokenId) {
    return p(this).deferrari.deferUntil(CONSTANTS.ROOT.SEQUELIZE_SYNC)
    .then(models => {
      return models.AuthToken.getById(authTokenId)
      .then(authToken => {
        return new Promise((resolve, reject) => {
          p(this).api.plus('v1').people.get({
            userId: 'me',
            auth: authClient(p(this).config, authToken.token)
          }, (err, response) => {
            if (err) reject(err);
            else resolve(response);
          })
        });
      });
    });
  }

  getAndSaveProfile(authTokenId) {
    return p(this).deferrari.deferUntil(CONSTANTS.ROOT.SEQUELIZE_SYNC)
    .then(models => {
      return this.getProfile(authTokenId)
      .then(profileData => {
        return models.AuthToken.setUserData(authTokenId, profileData)
        .then(() => profileData)
        .catch(err => err);
      })
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
