const RateSchema = {
  'title': 'Rate',
  'type': 'object',
  'properties': {
    'userId':{
      'type': 'string',
      'format': 'uid'
    },
    'comment': {
      'type': 'string'
    },
    'score': {
      'type': 'integer',
      'minimum': 0,
      'maximum': 5
    },
    'trainingId': {
      'type': 'string',
      'format': 'uid'
    }
  }
};

module.exports = {
  RateSchema
};