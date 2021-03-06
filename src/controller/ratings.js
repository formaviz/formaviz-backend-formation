const {Ratings} = require('../model');
const {getTrainingById} = require('../controller/trainings');
const {updateAllScores} = require('./trainings');
const {sendRatingMail} = require('../service/sendgrid-service');
const {sendRatingMessage, sendNewRaterMessage} = require('../service/rabbit-sender');
const {getUser} = require('./users');
const {logger} = require('../logger');
const db = require('../model/index');

const {sequelize} = db;

const getEmailsFromTraining = (idTraining, idUser) => {
  logger.info('[ Controller Ratings ] getEmailsFromTraining');
  const query = `SELECT "Users".email as "email" from "Users" join "Ratings" R on "Users"."idUser" = R."userOfRating"
  WHERE  R."trainingId" = '${idTraining}' AND R."userOfRating" != '${idUser}';`;

  return sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
    raw: true
  });
};

const sendMail = (rating, event, idUser) =>
  getTrainingById(rating.trainingId).then(training =>
    getEmailsFromTraining(rating.trainingId, idUser)
      .then((emails) => {

        const mappedEmails = emails.map(email => email.email);
        if (training && emails) {
          return sendRatingMail(mappedEmails,
            event,
            training.name,
            training.schoolCity,
            rating.comment,
            rating.score);
        }
        return null;
      }));


const getChannelId = (channelUri) => channelUri.split('').reverse().slice(0, 9).reverse().join('');

const alertRabbit = (idTraining, idUser, rating) => {
  getUser(idUser).then((user) => {
    getTrainingById(idTraining)
      .then((training) => {
        sendNewRaterMessage({
          eventType: 'ADD_USER',
          data: {
            name: `${training.name}_${training.schoolCity}`,
            idChannel: getChannelId(training.channelUri),
            email: user.email,
          }
        });
        sendRatingMessage({
          eventType: 'EVAL_FORMATION',
          data: {
            name: `${training.name}_${training.schoolCity}`,
            idChannel: getChannelId(training.channelUri),
            email: user.email,
            username: `${user.lastName}_${user.firstName}`,
            textNote: `${rating.comment} -- ${rating.score}/5`
          }
        });
      });
  });
};

// Story 2 : En tant que « évaluateur », je peux noter une formation, dans le but de partager mon avis
const createRating = ({comment, score, idTraining}, idUser) => {
  logger.info(' [ Controller Ratings ] createRating for training %s', idTraining);
  return Ratings.create({
      userOfRating: idUser,
      trainingId: idTraining,
      comment,
      score
    })
    .then(rating => {
      alertRabbit(idTraining, idUser, rating);
      sendMail(rating, 'créée', idUser);
      updateAllScores(rating.trainingId, rating.score);
      return rating;
    });
};

const getRatings = ({idUser, idTraining}) => {
  logger.info(' [ Controller Ratings ] getRatings ');
  let query = 'SELECT "idRating" as "idRate", "comment", "score", "trainingId" as "idTraining" FROM "Ratings" WHERE ';

  if (idUser) query += `"userOfRating" = '${idUser}' AND `;
  if (idTraining) query += `"trainingId" = '${idTraining}' AND `;

  if (query.substring(query.length - 4) === 'AND ') query = query.substr(0, query.length - 4);
  if (query.substring(query.length - 6) === 'WHERE ') query = query.substr(0, query.length - 6);

  logger.info(' [ Controller Ratings ] getRatings Query %s ', query);

  return sequelize.query(query, {
      type: sequelize.QueryTypes.SELECT,
      raw: true
    })
    .then(ratings => ratings);
};

const updateRating = ({comment, score}, idRate, idUser) => {
  logger.info(' [ Controller Ratings ] updateRating  %s', idRate);
  return Ratings.findOne({where: {idRating: idRate}})
    .then(rating =>
      (!rating || rating.userOfRating !== idUser)
        ? Promise.reject(new Error(`This rating has not been posted by user ${idUser}`))
        : rating)
    .then(() =>
      Ratings.update({
          comment: comment || '',
          score: score || ''
        }, {
          where: {idRating: idRate},
          returning: true,
          plain: true
        }
      ).then(results => {
        const rating = results[1].dataValues;
        sendMail(rating, 'modifiée', idUser);
        updateAllScores(rating.trainingId);
        return rating;
      })
    );
};

const deleteRating = (idRate, currentUser) => {
  logger.info(' [ Controller Ratings ] deleteRating  %s of user %s', idRate, currentUser.sub);
  return getUser(currentUser.sub)
    .then(user =>
      Ratings.findOne({
        where: {idRating: idRate}
      }).then(rating => {
        logger.info(` User ${user.idUser}  is admin ?  ${user.role === 'ADMIN'}`);
        logger.info(` User ${user.idUser}  is author of rating ? ${user.idUser === rating.userOfRating}`);
        logger.info(` Rating has been deleted ?  ${!rating.deletedAt}`);

        if ((user.role === 'ADMIN') || (user.idUser === rating.userOfRating) && (!rating.deletedAt)) {
          return Ratings.destroy({where: {idRating: rating.idRating}})
            .then(() =>
              updateAllScores(rating.trainingId, rating.score)
            );
        }
        return Promise.reject(new Error(`Rating ${idRate} could not be deleted `));
      })
    );
};

module.exports = {
  createRating,
  updateRating,
  getRatings,
  deleteRating
};
