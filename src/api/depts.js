const express = require('express');
const { getAllDepts } = require('../controller/depts');
const { logger } = require('../logger');

const apiDepts = express.Router();

apiDepts.get('/', (req, res) => {
  logger.info(' [ Api Depts ] GET all Depts');
  getAllDepts()
    .then(Depts => res.status(201).send({
        success: true,
        Depts,
        message: 'retrieved Depts',
      }))
    .catch(err => {
      logger.error(`💥 Failed to get Depts : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    });
});

module.exports = { apiDepts };
