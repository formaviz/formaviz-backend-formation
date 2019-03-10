const UserSchema = {
  'title': 'User',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'format': 'email',
    },
    'firstName': {
      'type': 'string',
      'maxLength': 128
    },
    'lastName': {
      'type': 'string',
      'maxLength': 128
    },
    'password': {
      'type': 'string',
      'maxLength': 128
    }
  }
};

const UserUpdateSchema = {
  'title': 'UserUpdate',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'format': 'email',
      'nullable': true,
    },
    'firstName': {
      'type': 'string',
      'maxLength': 128,
      'nullable': true,
    },
    'lastName': {
      'type': 'string',
      'maxLength': 128,
      'nullable': true,
    },
    'password': {
      'type': 'string',
      'maxLength': 128,
      'nullable': true,
    }
  }
};

const UserLoginSchema = {
  'title': 'User',
  'type': 'object',
  'properties': {
    'email': {
      'type': 'string',
      'format': 'email',
    },
    'password': {
      'type': 'string',
      'maxLength': 128
    }
  }
};

module.exports = {
  UserSchema,
  UserUpdateSchema,
  UserLoginSchema
};