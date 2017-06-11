'use strict';

module.exports = (models) => {
  const behaviors = {
    classMethods: {},
    instanceMethods: {},
    hooks: {},
    scopes: {}
  };

  // TODO implement.

  behaviors.classMethods.saveToken = function(token, provider, userData) {
    return this.create({
      provider,
      token,
      // userData
    })
    .then(result => {
      return result;
    });
  }


  return behaviors;
}
