'use strict';

const errors = require('punch-error');

const MODEL = 'auth_third_party_token';
const MODEL_PLURAL = 'auth_third_party_tokens';

const SCOPE = Object.freeze({});

const ERROR = Object.freeze({
  NOT_FOUND: new errors.NotFoundError({message: `${MODEL} not found.`}),
  FETCH: new errors.DatabaseError({message: `Could not fetch ${MODEL}`}),
  REQ_ID: new errors.RequiredAttributeError({message: `'id' missing for ${MODEL}`})
});

module.exports = Object.freeze({
  MODEL,
  MODEL_PLURAL,
  SCOPE,
  ERROR
});
