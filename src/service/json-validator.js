const Ajv = require('ajv');

const {
  UserSchema,
  UserLoginSchema,
  UserUpdateSchema,
} = require('../schema/user');

const {
  TrainingSchema,
  RabbitTrainingSchema,
  TRAINING_SCHEMA,
  RABBIT_TRAINING_SCHEMA
} = require('../schema/training');
const {
  RateSchema,
  RATE_SCHEMA
} = require('../schema/rate');

const USER_CREATION_SCHEMA = 'UserCreationSchema';
const USER_LOGIN_SCHEMA = 'UserLoginSchema';
const USER_UPDATE_SCHEMA = 'UserUpdateSchema';

const ajv = new Ajv();

ajv.addSchema(RateSchema, RATE_SCHEMA);
ajv.addSchema(TrainingSchema, TRAINING_SCHEMA);
ajv.addSchema(RabbitTrainingSchema, RABBIT_TRAINING_SCHEMA);
ajv.addSchema(UserSchema, USER_CREATION_SCHEMA);
ajv.addSchema(UserLoginSchema, USER_LOGIN_SCHEMA);
ajv.addSchema(UserUpdateSchema, USER_UPDATE_SCHEMA);

const validateSchema = (schemaName, body) => {
  const valid = ajv.validate(schemaName, body);

  return {valid, erros: ajv.errorsText()};
};

module.exports = {
  RATE_SCHEMA,
  USER_CREATION_SCHEMA,
  USER_LOGIN_SCHEMA,
  USER_UPDATE_SCHEMA,
  validateSchema,
};
