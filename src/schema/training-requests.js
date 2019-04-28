const getTrainingsSchema = {
  title: 'getTraingingSchema',
  type: 'object',
  properties: {
    admLevel: {
      type: 'integer',
      nullable: true,
    },
    diplomaLevel: {
      type: 'integer',
      nullable: true,
    },
    partTime: {
      type: 'boolean',
      nullable: true,
    },
    expertise: {
      nullable: true,
    },
    duration: {
      type: 'integer',
      nullable: true,
    },
    dep: {
      type: 'integer',
      nullable: true,
    },
    city: {
      type: 'string',
      nullable: true,
    },
    region: {
      type: 'string',
      nullable: true,
    },
  }
};

module.exports = {
  getTrainingsSchema,
};