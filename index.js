'use strict';

const Deferrari = require('deferrari');

const bootstrapModels = require('./models');
const CONSTANTS = require('./constants');
const p = require('./privatory')();


class AuthieThirdParty {
  constructor(config) {
    if (!config) throw new Error('config missing for authie third party.');
    if (!config.sequelize) throw new Error('sequelize client was not provided');
    p(this).config = config;

    p(this).deferrari = new Deferrari();

    this.models = bootstrapModels(p(this).config.sequelize);

    if (config.fb && config.google) {
      throw new Error('configuration for any one of google or facebook required');
    }

    if (config.google) {
      p(this).google = require('./parties/google')(
        config.google, p(this).deferrari
      );
    }

    if (config.facebook) {
      // TODO init facebook auth.
    }

    this.sync();
  }

  sync() {
    p(this).config.sequelize.sync()
    .then(() => p(this).deferrari.resolve(
      CONSTANTS.SEQUELIZE_SYNC, this.models
    ))
    .catch(err => {
      throw new Error(err);
    });
  }

  get google() {
    if (!p(this, true).google) throw new Error('google auth was not set up.');
    return p(this, true).google;
  }
}

module.exports = config => new AuthieThirdParty(config);
