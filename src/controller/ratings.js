/* eslint-disable linebreak-style */
const { Ratings, Trainings } = require('../model');
const { checkLowestScore, checkHighestScore, updateAverageScore } = require('./trainings');
const { logger } = require('../logger');
const db = require('../model/index');
const sequelize = db.sequelize;

// Story 2 : En tant que « évaluateur », je peux noter une formation, dans le but de partager mon avis
const createRating = ({ comment, score, idTraining }, idUser) => {
    logger.info(' [ Controller Ratings ] createRating for training %s', idTraining);
    return Ratings.create ({
        userOfRating: idUser,
        trainingId: idTraining,
        comment,
        score
    })
        .then (rating => {
            return Trainings.findOne({where :{ idTraining }})
            .then(training => {
                logger.info(' [ Controller Ratings ] checkLowestScore to do on training %s', training.idTraining);
                return checkLowestScore(training, rating.score) })
            .then(training => {
                logger.info(' [ Controller Ratings ] checkHighestScore to do on training %s', training.idTraining);
                return checkHighestScore(training, rating.score) })
            .then(training => {
                logger.info(' [  Controller Ratings ] updateAverageScore on training %s', training.idTraining);
                return updateAverageScore(training, rating.score) })
            })
        .then(rating => {
            return rating
        })
};



const getRatings = ({ idUser, idTraining }) => {
    logger.info(' [ Controller Ratings ] getRatings ');
    let query = 'SELECT "idRating" as "idRate", "comment", "score", "trainingId" as "idTraining" FROM "Ratings" WHERE ';

    if (idUser) query += '"userOfRating" =  \'' + idUser + '\' AND ';
    if (idTraining) query += '"trainingId" = \'' + idTraining + '\' AND ';

    if (query.substring(query.length -4) === 'AND ') query = query.substr(0, query.length - 4);
    if (query.substring(query.length -6) === 'WHERE ') query = query.substr(0, query.length - 6);

    logger.info(' [ Controller Ratings ] getRatings Query %s ', query);

    return sequelize.query(query, {
        type: sequelize.QueryTypes.SELECT,
        raw: true
    })
    .then(ratings => {
        return ratings
    })
};


const updateRating = ({ comment, score }, idRate, idUser ) => {
    logger.info(' [ Controller Ratings ] updateRating  %s', idRate);
    return Ratings.findOne({ where: {idRating: idRate}})
        .then(rating => {
            return (rating.userOfRating !== idUser) ? Promise.reject(new Error('This rating has not been posted by user ' + idUser)) : rating
        })
        .then(() => {return Ratings.update({
                comment : comment || '',
                score: score || ''
            },{
                where: {idRating: idRate} ,
                returning : true,
                plain: true}
        ).then (results => {
            console.log(results);
            const rating = results[1].dataValues;
            return Trainings.findOne({where :{ idTraining: rating.trainingId }})
                .then(training => {
                    logger.info(' [ Controller Ratings ] checkLowestScore to do on training %s', training.idTraining);
                    return checkLowestScore(training, rating.score) })
                .then(training => {
                    logger.info(' [ Controller Ratings ] checkHighestScore to do on training %s', training.idTraining);
                    return checkHighestScore(training, rating.score) })
                .then(training => {
                    logger.info(' [  Controller Ratings ] updateAverageScore on training %s', training.idTraining);
                    return updateAverageScore(training, rating.score) })
                .then(() =>  rating )
        })
    })
};


module.exports = {
    createRating,
    updateRating,
    getRatings
};
