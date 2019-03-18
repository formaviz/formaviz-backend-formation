const { Levels } = require('../model');
const { logger } = require('../logger');

const getAllLevels = () => {
    logger.info(' [ Levels Api ] retrieving all levels ');
    return Levels.findAll({
        where: {
            deletedAt: null
        }
    })
};

module.exports = {
    getAllLevels
};
