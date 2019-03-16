/* eslint-disable linebreak-style */
const { Ratings, Trainings } = require('../model');
const { logger } = require('../logger');
const Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres', 'postgres', 'password', {'dialect': 'postgresql'});

// Story 2 : En tant que « évaluateur », je peux noter une formation, dans le but de partager mon avis
const createRating = ({ comment, score, idTraining}, idUser) => {
    logger.info(' [ Controller ] createRating for training %s', idTraining);
    return Ratings.create ({
        idUser,
        comment,
        score,
        trainingId: idTraining
    }).then (rating => {
        return rating
    })
};

module.exports = {
    createRating
};
