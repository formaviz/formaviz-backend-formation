const Ajv = require('ajv');

const {
  UserSchema,
  UserLoginSchema,
  UserUpdateSchema
} = require('../schema/user');

const USER_CREATION_SCHEMA = 'UserCreationSchema';
const USER_LOGIN_SCHEMA = 'UserLoginSchema';
const USER_UPDATE_SCHEMA = 'UserUpdateSchema';
const ajv = new Ajv();

ajv.addSchema(UserSchema, USER_CREATION_SCHEMA);
ajv.addSchema(UserLoginSchema, USER_LOGIN_SCHEMA);
ajv.addSchema(UserUpdateSchema, USER_UPDATE_SCHEMA);

const validateUser = (schemaName, user) => {
  const valid = ajv.validate(schemaName, user);

  return {valid, erros: ajv.errorsText()};
};

module.exports = {
  validateUser,
};