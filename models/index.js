'use strict';

module.exports = (sequelize) => {
  const models = {};
  Object.assign(models, {
    AuthToken: initModel('auth-third-party-tokens', models)
  });

  function initModel(modelName) {
    const behaviors = require(`./${modelName}/behaviors`)(models);
    const schema = require(`./${modelName}/schema`);
    const CONSTANTS = require(`./${modelName}/constants`);

    const Model = sequelize.define(
      CONSTANTS.MODEL,
      schema.DEFINITION_OBJECT,
      // Adds behaviors to schema definition.
      Object.assign({}, schema.CONFIGURATION_OBJECT, behaviors)
    );

    return Model;
  }

  return models;
}
