/* eslint-disable linebreak-style */
const express = require('express');
const jwt = require('jwt-simple');
const { createTraining, getTrainings } = require('../controller/trainings');
const { logger } = require('../logger');
const {
  validateSchema,
  TRAINING_SCHEMA,
} = require('../service/json-validator');

const apiTrainings = express.Router();

apiTrainings.post('/', (req, res) => {
  const valid = validateSchema(TRAINING_SCHEMA, req.body);
  if (!valid.valid) {
    return res.status(400).send(valid.erros);
  }
  return createTraining(req.body)
    .then(training => {
      logger.info(' api training successfully created %s', training.name);
      return res.status(201).send({
        success: true,
        profile: training,
        message: 'training created',
      });
    })
    .catch(err => {
      logger.error(`💥 Failed to create training : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    });
});

apiTrainings.get('/', (req, res) => {
  logger.info(' [ apiTrainings ] GET Training by query param ');

  getTrainings(req.query)
    .then(trainings => res.status(201).send({
        success: true,
        trainings,
        message: 'trainings retrieved',
      }))
    .catch(err => {
      logger.error(`💥 Failed to get trainings : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    });
});

module.exports = { apiTrainings };
