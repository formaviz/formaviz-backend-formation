const { Levels } = require('../model');
const { logger } = require('../logger');

const getAllLevels = () => {
  logger.info(' [ Levels Api ] retrieving all levels ');
  return Levels.findAll({
    attributes: ['idLevel', 'grade', 'level', 'nbECTS', 'title'],
    where: {
      deletedAt: null,
    },
  });
};

module.exports = {
  getAllLevels,
};
