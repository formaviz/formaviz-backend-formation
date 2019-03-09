const express = require('express');
const jwt = require('jwt-simple');
const { createTraining } = require('../controller/trainings');
const { logger } = require('../logger');

const apiTrainings = express.Router();

apiTrainings.post('/', (req, res) => {
    createTraining(req.body)
    .then(training => {
        logger.info(' api training successfully created %s', training.name);
        return res.status(201).send({
            success: true,
            profile: training,
            message: 'training created'
        });
    })
    .catch(err => {
        logger.error(`💥 Failed to create training : ${err.stack}`);
        return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
        });
    })
});

module.exports = { apiTrainings };
