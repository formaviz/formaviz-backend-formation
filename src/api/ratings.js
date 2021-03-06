/* eslint-disable linebreak-style */
const express = require('express');
const {checkJwt, getUser} = require('../controller/auth');
const {createRating, getRatings, updateRating, deleteRating} = require('../controller/ratings');
const {logger} = require('../logger');
const {validateSchema, RATE_SCHEMA} = require('../service/json-validator');

const apiRatings = express.Router();

apiRatings.post('/', [checkJwt, getUser], (req, res) => {
  logger.info(' [ Api ] POST Rate');
  const valid = validateSchema(RATE_SCHEMA, req.body);
  if (!valid.valid) {
    return res.status(400).send(valid.erros);
  }
  return createRating(req.body, req.user.sub)
    .then(rating => {
      logger.info(' api rating successfully created rate for training %s ', rating.idTraining);
      return res.status(201).send({
        success: true,
        rating,
        message: 'rating created'
      });
    })
    .catch(err => {
      logger.error(`💥 Failed to create rating : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
      });
    });
});


apiRatings.get('/', (req, res) => {
  logger.info(' [ Api Ratings ] GET all ratings by query param idUser %s and idTraining %s', req.query.idUser, req.query.idTraining);
  getRatings(req.query)
    .then(ratings =>
      res.status(201).send({
        success: true,
        ratings,
        message: 'ratings retrieved'
      }))
    .catch(err => {
      logger.error(`💥 Failed to get ratings : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
      });
    });
});


// Story 3 : En tant que « évaluateur », je peux modifier une note que j’ai créé, dans le but de corriger une erreur
apiRatings.patch('/:idRate', [checkJwt, getUser], (req, res) => {
  logger.info(' [ Api Ratings ] Update rating of user %s for training %s', req.user.sub, req.body.idTraining);
  updateRating(req.body, req.params.idRate, req.user.sub)
    .then(rating =>
      res.status(201).send({
        success: true,
        rating,
        message: 'rating updated'
      }))
    .catch(err => {
      logger.error(`💥 Failed to update rating : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
      });
    });
});


// Story 4 : En tant que « évaluateur », je peux supprimer une note que j’ai créé, dans le but de supprimer mon partage d’avis
// Story 5 : En tant que « administrateur », je peux supprimer une note dans le but de modérer les abus ou faire respecter les critères de publication.
apiRatings.delete('/:idRate', [checkJwt, getUser], (req, res) => {
  logger.info(' [ Api Ratings ] Delete rating %s of user %s for training %s', req.params.idRate, req.user.sub);
  deleteRating(req.params.idRate, req.user)
    .then(rating =>
      res.status(201).send({
        success: true,
        rating,
        message: 'rating deleted'
      }))
    .catch(err => {
      logger.error(`💥 Failed to delete rating : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`
      });
    });
});


module.exports = {apiRatings};
