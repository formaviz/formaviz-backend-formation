const UserSchema = {
  title: 'User',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    firstName: {
      type: 'string',
      maxLength: 128,
      minLength: 1,
    },
    lastName: {
      type: 'string',
      maxLength: 128,
      minLength: 1,
    },
    password: {
      type: 'string',
      maxLength: 128,
      minLength: 6
    },
    role: {
      enum: [ 'EVAL', 'PROSPECT', 'STAFF', 'ADMIN' ],
    },
  },
};

const UserUpdateSchema = {
  title: 'UserUpdate',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
      nullable: true,
    },
    firstName: {
      type: 'string',
      maxLength: 128,
      minLength: 1,
      nullable: true,
    },
    lastName: {
      type: 'string',
      maxLength: 128,
      minLength: 1,
      nullable: true,
    },
    password: {
      type: 'string',
      maxLength: 128,
      minLength: 6,
      nullable: true,
    },
    role: {
      type: 'string',
      maxLength: 128,
      enum: [ "EVAL", "PROSPECT", "STAFF", "ADMIN" ],
   },
  },
};

const UserLoginSchema = {
  title: 'User',
  type: 'object',
  properties: {
    email: {
      type: 'string',
      format: 'email',
    },
    password: {
      type: 'string',
      maxLength: 128,
    },
  },
};

module.exports = {
  UserSchema,
  UserUpdateSchema,
  UserLoginSchema,
};
