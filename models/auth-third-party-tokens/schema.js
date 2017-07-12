'use strict';

const Sequelize = require('sequelize');
const uuid = require('node-uuid');

const CONSTANTS = require('./constants');


const DEFINITION_OBJECT = {
  id: {type: Sequelize.UUID, primaryKey: true, defaultValue: uuid.v4},
  provider: {type: Sequelize.STRING, allowNull: false},
  token: {type: Sequelize.TEXT, allowNull: false},
  tokenData: {type: Sequelize.JSONB},
  userData: {type: Sequelize.JSONB}
};

const CONFIGURATION_OBJECT = {
  tableName: CONSTANTS.MODEL_PLURAL,
  name: {
    singular: CONSTANTS.MODEL,
    plural: CONSTANTS.MODEL_PLURAL
  },
  timestamps: true,
  underscored: true,
  indexes: [
    {
      fields: ['provider']
    },
    {
      fields: ['token'],
      unique: true
    },
  ]
};


module.exports = Object.freeze({
  DEFINITION_OBJECT,
  CONFIGURATION_OBJECT
});
