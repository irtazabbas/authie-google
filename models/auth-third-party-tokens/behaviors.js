'use strict';

const AppErr = require('punch-error').ApplicationError;
const CONSTANTS = require('./constants');
const ERROR = CONSTANTS.ERROR;

module.exports = (models) => {
  const behaviors = {
    classMethods: {},
    instanceMethods: {},
    hooks: {},
    scopes: {}
  };

  behaviors.classMethods.saveToken = function(token, provider, userData) {
    return this.create({
      provider,
      token,
      userData
    })
    .then(result => {
      return result;
    });
  }

  behaviors.classMethods.getById = function(id) {
    if (!id) return AppErr.reject(null, ERROR.REQ_ID);

    return this.findById(id)
    .then(token => {
      if (!token) return AppErr.reject(null, ERROR.NOT_FOUND);

      return token;
    });
  }

  return behaviors;
}
