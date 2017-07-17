'use strict';

const google = require('googleapis');

const authClient = require('./auth-client');
const CONSTANTS = require('./constants');
const p = require('../../privatory')();
const _ = require('lodash');

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

            models.ThirdPartyToken.saveToken(token, PROVIDER, result)
            .then(authToken => {
              this.getAndSaveProfile(authToken.id)
              .then(profile => {
                let email = '';
                let emails = profile.emailAddresses;
                if (emails && emails.length) {
                  email = _.get(emails.find(e => e.metadata.primary), 'value')
                    || email;
                }
                  profile.emailAddresses.find(el => el.metadata.primary);
                resolve({authToken, email});
              });
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
      return models.ThirdPartyToken.getById(authTokenId)
      .then(authToken => {
        return new Promise((resolve, reject) => {
          p(this).api.people('v1').people.get({
            resourceName: 'people/me',
            personFields: 'emailAddresses,names',
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
        return models.ThirdPartyToken.setUserData(authTokenId, profileData)
        .then(() => profileData)
        .catch(err => err);
      })
    });
  }

  getAuthUrl(scopes) {
    scopes = scopes && scopes.length ?
      scopes : Object.keys(CONSTANTS.SCOPES).map(key => CONSTANTS.SCOPES[key]);
    return new Promise((resolve, reject) => {
      resolve(p(this).auth.generateAuthUrl({
        scope: scopes,
        access_type: 'offline'
      }));
    });
  }
}

module.exports = (config, deferrari) => new GoogleAuthie(config, deferrari);
