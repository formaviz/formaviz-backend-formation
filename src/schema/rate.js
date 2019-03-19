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
    trainingId: {
      type: 'string',
      format: 'uuid',
    },
  },
};

module.exports = {
  RateSchema,
};
