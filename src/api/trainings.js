const express = require('express');
const jwt = require('jwt-simple');
const { createTraining, getTrainings } = require('../controller/trainings');
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


apiTrainings.get('/', (req, res) => {
    logger.info(' apiTrainings diplomaLevel %s', req.query.diplomaLevel);
    logger.info(' apiTrainings diplomaLevel %s', req.query.admLevel);
    for (const key in req.query) {
        logger.info(key, req.query[key])
    }
    const admLevel = req.query.admLevel || '*'
    getTrainings(admLevel, req.query.diplomaLevel, req.query.partTime, req.query.expertise, req.query.duration, req.query.dep, req.query.city)
        .then(trainings => {
            return res.status(201).send({
                success: true,
                trainings,
                message: 'trainings retrieved'
            });
        })
        .catch(err => {
            logger.error(`💥 Failed to get trainings : ${err.stack}`);
            return res.status(500).send({
                success: false,
                message: `${err.name} : ${err.message}`
            });
        })
});



module.exports = { apiTrainings };
