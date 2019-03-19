/* eslint-disable linebreak-style */
const { Ratings, Trainings } = require('../model');
const { checkLowestScore, checkHighestScore, updateAverageScore } = require ('./trainings');
const { logger } = require('../logger');


// Story 2 : En tant que « évaluateur », je peux noter une formation, dans le but de partager mon avis
// const createRating = ({ comment, score, idTraining}, idUser) => {
const createRating = ({ idUser, comment, score, idTraining }) => {
    logger.info(' [ Controller ] createRating for training %s', idTraining);
    return Ratings.create ({
        userOfRating: idUser,
        trainingId: idTraining,
        comment,
        score
    }).then (rating => {

        Trainings.findOne({where :{ idTraining }}).then(training => {
            logger.info(' [ Rating Api ] checkLowestScore to do on training %s', training.idTraining);
            checkLowestScore(training, rating.score)
            .then(() => {
               logger.info(' [ Rating Api ] checkHighestScore to do on training %s', training.idTraining);
               checkHighestScore(training, rating.score)
               .then(() => {
                  logger.info(' [ Rating Api ] updateAverageScore on training %s', training.idTraining);
                  updateAverageScore(training, rating.score)
                  })
            });
        });
        return rating
    })
};


module.exports = {
    createRating
};
