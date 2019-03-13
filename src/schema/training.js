const TRAINING_SCHEMA = 'TrainingSchema';

const TrainingSchema = {
  title: TRAINING_SCHEMA,
  type: 'object',
  properties: {
    name: {
      type: 'string',
      maxLength: 128,
    },
    description: {
      type: 'string',
      nullable: true,
    },
    expertise: {
      type: 'string',
      nullable: true,
    },
    admLevel: {
      type: 'array',
      items: {
        type: 'integer',
        maximum: 15,
        minimum: 0,
      },
    },
    diplomaLevel: {
      type: 'integer',
      nullable: true,
    },
    partTime: {
      type: 'boolean',
      nullable: true,
    },
    logoPath: {
      type: 'string',
      format: 'uri',
      nullable: true,
    },
    link: {
      type: 'string',
      format: 'uri',
      nullable: true,
    },
    duration: {
      type: 'integer',
      maximum: 15,
      minimum: 0,
    },
    school: {
      type: 'object',
      properties: {
        schoolName: {
          type: 'string',
        },
        schoolDescription: {
          type: 'string',
          nullable: true,
        },
        schoolAddress: {
          type: 'string',
        },
        schoolPostalCode: {
          type: 'string',
        },
        schoolCity: {
          type: 'string',
          nullable: true,
        },
        channelUri: {
          type: 'string',
          nullable: true,
        },
      },
    },
  },
};

const RABBIT_TRAINING_SCHEMA = 'RabbitTrainingSchema';

const RabbitTrainingSchema = {
  title: RABBIT_TRAINING_SCHEMA,
  type : 'object',
  properties: {
    action: {
      type: 'string',
      nullable: false
    },
    state: {
      type: 'string',
      nullable: false
    },
    message: {
      type: 'object',
      nullable: false,
      properties: {
        url: {
          type: 'string',
          format: 'uri',
          nullable: false
        }

      }
    }
  },
};

module.exports = {
  TrainingSchema,
  RabbitTrainingSchema,
  TRAINING_SCHEMA,
  RABBIT_TRAINING_SCHEMA,
};
