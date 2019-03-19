const express = require('express');
const { getAllLevels } = require('../controller/levels');
const { logger } = require('../logger');

const apiLevels = express.Router();

apiLevels.get('/', (req, res) => {
  logger.info(' [ Api Levels ] GET all levels');
  getAllLevels()
    .then(levels => res.status(201).send({
        success: true,
        levels,
        message: 'get levels',
      }))
    .catch(err => {
      logger.error(`💥 Failed to get levels : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    });
});

module.exports = { apiLevels };
