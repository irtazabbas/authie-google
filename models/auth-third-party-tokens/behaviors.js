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

  behaviors.classMethods.saveToken = function(token, provider, tokenData) {
    return this.create({
      provider,
      token,
      tokenData
    });
  };

  behaviors.classMethods.getById = function(id) {
    if (!id) return AppErr.reject(null, ERROR.REQ_ID);

    return this.findById(id)
    .then(token => {
      if (!token) return AppErr.reject(null, ERROR.NOT_FOUND);

      return token;
    });
  };

  behaviors.classMethods.setUserData = function(id, userData) {
    if (!id) return AppErr.reject(null, ERROR.REQ_ID);

    return this.update({userData}, {where: {id}});
  };

  return behaviors;
}
