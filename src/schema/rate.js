const RATE_SCHEMA = 'RateSchema';

const RateSchema = {
  title: 'Rate',
  type: 'object',
  properties: {
    comment: {
      type: 'string',
    },
    score: {
      type: 'integer',
      minimum: 0,
      maximum: 5,
    },
    idTraining: {
      type: 'string',
      format: 'uuid',
    },
  },
  required: ['comment', 'score', 'idTraining']
};

module.exports = {
  RateSchema,
  RATE_SCHEMA,
};
