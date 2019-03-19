/* eslint-disable linebreak-style */
const express = require('express');
const jwt = require('jwt-simple');
const { checkJwt } = require('../controller/auth');
const { createRating, getRatings } = require('../controller/ratings');
const { logger } = require('../logger');
const { validateSchema, RATE_SCHEMA } = require('../service/json-validator');

const apiRatings = express.Router();

// apiRatings.post('/', checkJwt, (req, res) => {
apiRatings.post('/', (req, res) => {
    logger.info(' [ Api ] POST Rate');
    const valid = validateSchema(RATE_SCHEMA, req.body);
    if (!valid.valid) {
        return res.status(400).send(valid.erros);
    }
    // return createRating(req.body, req.user.id)
    return createRating(req.body)
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



apiRatings.get('/', (req, res) => {
    logger.info(' [ Api Ratings ] GET all ratings %s %s', req.body.idUser, req.body.idTraining);

    getRatings(req.body)
        .then(ratings => {
            return res.status(201).send({
                success: true,
                ratings,
                message: 'ratings retrieved'
            });
        })
        .catch(err => {
            logger.error(`💥 Failed to get ratings : ${err.stack}`);
            return res.status(500).send({
                success: false,
                message: `${err.name} : ${err.message}`
            });
        })
});


// Story 3 : En tant que « évaluateur », je peux modifier une note que j’ai créé, dans le but de corriger une erreur
apiRatings.patch('/:idRate', (req, res) => {
        req.body.idRating = req.params.idRate;
        updateRating(req.body)
            .then(rating => {
                return res.status(201).send({
                    success: true,
                    rating,
                    message: 'rating updated'
                });
            })
            .catch(err => {
                logger.error(`💥 Failed to update rating : ${err.stack}`);
                return res.status(500).send({
                    success: false,
                    message: `${err.name} : ${err.message}`
                });
            });
    }
);


// Story 4 : En tant que « évaluateur », je peux supprimer une note que j’ai créé, dans le but de supprimer mon partage d’avis
// Story 5 : En tant que « administrateur », je peux supprimer une note dans le but de modérer les abus ou faire respecter les critères de publication.

module.exports = { apiRatings };
