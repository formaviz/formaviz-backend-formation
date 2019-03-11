const TrainingSchema = {
  'title': 'Training',
  'type': 'object',
  'properties': {
    'name': {
      'type': 'string',
      'maxLength': 128
    },
    'description': {
      'type': 'string',
      'nullable': true,
    },
    'expertise': {
      'type': 'string',
      'nullable': true,
    },
    'admLevel': {
      'type': 'array',
      'items': {
        'type': 'string'
      },
    },
    'partTime': {
      'type': 'boolean',
      'nullable': true,
    },
    'logoPath': {
      'type': 'string',
      'format': 'uri',
      'nullable': true,
    },
    'link': {
      'type': 'string',
      'format': 'uri',
      'nullable': true,
    },
    'duration': {
      'type': 'integer',
      'maximum': 15,
      'minimum': 0
    },
    'school': {
      'type': 'object',
      'properties': {
        'schoolName': {
          'type': 'string',
        },
        'schoolDescription': {
          'type': 'string',
          'nullable': true,
        },
        'schoolAddress': {
          'type': 'string',
        },
        'schoolPostalCode': {
          'type': 'string'
        },
        'schoolCity': {
          'type': 'string',
          'nullable': true,
        },
      }
    },
  }
};

module.exports = {
  TrainingSchema
};