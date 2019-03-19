/* eslint-disable linebreak-style */
const { Ratings, Trainings } = require('../model');
const {
  checkLowestScore,
  checkHighestScore,
  updateAverageScore,
} = require('./trainings');
const { logger } = require('../logger');
const db = require('../model/index');
const sequelize = db.sequelize;

// Story 2 : En tant que « évaluateur », je peux noter une formation, dans le but de partager mon avis
// const createRating = ({ comment, score, idTraining}, idUser) => {
const createRating = ({ comment, score, idTraining }, idUser) => {
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


// const updateRating = ({ idRating, comment, score })

const getRatings = ({ idUser, idTraining }) => {
    logger.info(' [ Controller ] getRatings ');
    let query = 'SELECT "idRating", "comment", "score", "trainingId" as "idTraining" FROM "Ratings" WHERE ';

    if (idUser) query += '"userOfRating" =  \'' + idUser + '\' AND ';
    if (idTraining) query += '"trainingId" = \'' + idTraining + '\' AND ';

    if (query.substring(query.length -4) === 'AND ') query = query.substr(0, query.length - 4);
    if (query.substring(query.length -6) === 'WHERE ') query = query.substr(0, query.length - 6);

    logger.info(' [ Controller ] getRatings Query %s ', query);

    return sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        raw: true
    })
        .then(ratings => {
            return ratings
        })
};

module.exports = {
    createRating,
    // updateRating,
    getRatings
};
