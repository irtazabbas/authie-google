'use strict';

const Deferrari = require('deferrari');

const sequelizeConnect = require('./database/sequelize');
const bootstrapModels = require('./models');

const CONNECTED = 'connected';


// This establishes a private namespace.
const namespace = new WeakMap();
function p(object, dontSet) {
  if (!namespace.has(object) && !dontSet) namespace.set(object, {});
  return namespace.get(object);
}


class AuthieThirdParty {
  constructor(config) {
    p(this).config = config || {};
    p(this).config.dbConfig = config.dbConfig || {};

    if (config.fb && config.google) {
      throw new Error('configuration for any one of google or facebook required');
    }

    if (config.google) {
      p(this).google = require('./parties/google')(config.google);
    }

    if (config.facebook) {
      // TODO init facebook auth.
    }

    p(this).deferrari = new Deferrari();

    this.connect(p(this).config);
  }

  get google() {
    if (!p(this, true).google) throw new Error('google auth was not set up.');
    return p(this, true).google;
  }

  connect(config) {
    p(this).sequelize = sequelizeConnect.newClient(config.dbConfig);

    // TODO add cache.

    return sequelizeConnect.connect(p(this).sequelize)
    .then(() => {
      if (config.sync) p(this).sequelize.sync();
      return p(this).deferrari.resolve(
        CONNECTED, bootstrapModels(p(this).sequelize)
      );
    });
  }
}

module.exports = config => new AuthieThirdParty(config);
