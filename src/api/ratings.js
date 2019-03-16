/* eslint-disable linebreak-style */
const express = require('express');
const jwt = require('jwt-simple');
const { checkJwt } = require('../controller/auth');
const { createRating } = require('../controller/ratings');
const { logger } = require('../logger');
const { validateSchema, RATE_SCHEMA } = require('../service/json-validator');


const apiRatings = express.Router();


apiRatings.post('/', checkJwt, (req, res) => {
    logger.info(' [ Api ] POST Rate');
    const valid = validateSchema(RATE_SCHEMA, req.body);
    if (!valid.valid) {
        return res.status(400).send(valid.erros);
    }
    return createRating(req.body, req.user.id)
        .then(rating => {
            logger.info(' api rating successfully created rate for user and training %s %s', rating.userOfRating, rating.trainingId);
            return res.status(201).send({
                success: true,
                profile: rating,
                message: 'rating created'
            });
        })
        .catch(err => {
            logger.error(`💥 Failed to create rating : ${err.stack}`);
            return res.status(500).send({
                success: false,
                message: `${err.name} : ${err.message}`
            });
        })
});



module.exports = { apiRatings };
