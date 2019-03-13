const express = require('express');

/* eslint-disable linebreak-style */
const {createTraining, getTrainings, getTrainingById} = require('../controller/trainings');
const {checkJwt, getUser} = require('../controller/auth');
const {logger} = require('../logger');
const {validateSchema} = require('../service/json-validator');
const {TRAINING_SCHEMA} = require('../schema/training');

const apiTrainings = express.Router();

apiTrainings.post('/', [checkJwt, getUser], (req, res) => {
  const valid = validateSchema(TRAINING_SCHEMA, req.body);
  if (!valid.valid) {
    return res.status(400).send(valid.erros);
  }
  return createTraining(req.body, req.user)
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


apiTrainings.get('/:idTraining', (req, res) => {
  logger.info(' [ apiTrainings ] GET Training by id %s', req.params.idTraining);

  getTrainingById(req.params.idTraining)
    .then(training => res.status(201).send({
      success: true,
      training,
      message: 'training retrieved',
    }))
    .catch(err => {
      logger.error(`💥 Failed to get training : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    });
});

module.exports = {apiTrainings};
