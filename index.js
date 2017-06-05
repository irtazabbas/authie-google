'use strict';

const Deferrari = require('deferrari');

const sequelizeConnect = require('./database/sequelize');
const bootstrapModels = require('./models');

const CONNECTED = 'connected';


// This establishes a private namespace.
const namespace = new WeakMap();
function p(object) {
  if (!namespace.has(object)) namespace.set(object, {});
  return namespace.get(object);
}


class AuthieThirdParty {
  constructor(config) {
    p(this).config = config || {};
    p(this).config.dbConfig = config.dbConfig || {};

    p(this).deferrari = new Deferrari();

    this.connect(p(this).config);
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

  verifyFromGoogle() {
    // TODO implement.
    return Promise.resolve();
  }
}

module.exports = (config) => new AuthieThirdParty(config);
