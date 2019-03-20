/* eslint-disable linebreak-style */
const { Trainings } = require('../model');
const { logger } = require('../logger');
const db = require('../model/index');
const sequelize = db.sequelize;

const createTraining = ({
  name,
  description,
  logoPath,
  admLevel,
  expertise,
  diplomaLevel,
  duration,
  partTime,
  link,
  school,
}) => {
  logger.info(' [ Controller ] createTraining %s', name);
  return Trainings.create({
    name,
    description: description || '',
    logoPath: logoPath || '',
    admLevel: admLevel || '',
    expertise: expertise || '',
    diplomaLevel,
    duration,
    partTime: partTime || false,
    link: link || '',
    schoolName: school.name,
    schoolAddress: school.street || '',
    schoolPostalCode: school.cp,
    schoolCity: school.city || '',
    deptId: school.cp.substr(0, 2),
    schoolDescription: school.description || '',
  }).then(training => {
    logger.info(' Controller adding admLevel to new training');
    training.addAdmissionLevels(admLevel);
    return training;
  });
};

const checkLowestScore = (training) => {
  logger.info(' [ Controller ] check Lowest Score for training %s', training.idTraining);

    const query = 'UPDATE "Trainings" t set "lowestScore"=(SELECT min("score") FROM "Ratings" r WHERE  r."trainingId" = ?) WHERE t."idTraining"= ? RETURNING *';
    return sequelize
        .query(query, {
            replacements: [training.idTraining, training.idTraining],
            type: sequelize.QueryTypes.UPDATE,
            raw: true,
        })
        .then(result => {
            logger.info(' [ Controller Trainings ] lowest score %s', result[0][0].lowestScore);
            console.log('result ',result);
            console.log('result[0][0] ', result[0][0]);
            return result[0][0];
        });
};

const checkHighestScore = (training) => {
  logger.info(' [ Controller ] check Highest Score for training %s', training.idTraining);
    const query = 'UPDATE "Trainings" t set "highestScore"=(SELECT max("score") FROM "Ratings" r WHERE  r."trainingId" = ?) WHERE t."idTraining"= ? RETURNING *';
    return sequelize
        .query(query, {
            replacements: [training.idTraining, training.idTraining],
            type: sequelize.QueryTypes.UPDATE,
            raw: true,
        })
        .then(result => {
            logger.info(' [ Controller Trainings ] highest score %s', result[0][0].lowestScore);
            console.log('result ',result);
            return result[0][0];
        });
};

const updateAverageScore = (training) => {
  logger.info(' [ Controller ] update average score for training %s', training.idTraining);

    const query = 'SELECT AVG (score) FROM "Ratings" WHERE "trainingId" = ?';
    return sequelize.query(query, {
        replacements: [training.idTraining],
        type: sequelize.QueryTypes.SELECT,
        raw: true,
      })
      .then(result => {
        logger.info(' [ Controller ] computed average score %s', result[0].avg);
        console.log(result);
        Trainings.update(
          {
            averageScore: result[0].avg,
          },
          { where: { idTraining: training.idTraining } }
        ).then(() =>
          training && !training.deletedAt
            ? Promise.resolve(training)
            : Promise.reject(new Error('Unknown or deleted training'))
        );
      });
};

const getTrainings = ({
  admLevel,
  diplomaLevel,
  partTime,
  expertise,
  duration,
  dep,
  city,
  region,
}) => {
  logger.info(' [ Controller Trainings ]  getTraining()');

  let query =
    'SELECT to_json(sub) AS training FROM  (SELECT t.*, d."deptName", d."regionName", json_agg(l."grade") AS "admLevels", (SELECT l."grade" FROM "Levels" l WHERE l."idLevel" = t."diplomaLevel") as "diplomaName" FROM "Trainings" t LEFT JOIN "admLevels" a on t."idTraining" = a."idTraining" LEFT JOIN "Levels" l on a."idLevel" = l."idLevel" LEFT JOIN "Depts" d on t."deptId" = d."idDept" WHERE ';

  if (admLevel) query += 'a."idLevel" IN (:admLevel) AND ';
  if (diplomaLevel) query += '"diplomaLevel" = :diplomaLevel AND ';
  if (partTime) query += '"partTime" = :partTime AND ';
  if (expertise) query += 'LOWER("expertise") LIKE LOWER(:expertise) AND ';
  if (duration) query += '"duration" = :duration AND ';
  if (dep) query += '"deptId" = :dep AND ';
  if (city) query += 'LOWER("schoolCity") LIKE LOWER(:city) AND ';
  if (region) query += 'LOWER(d."regionName") LIKE LOWER(:region) ';

  if (query.substring(query.length - 4) === 'AND ')
    query = query.substr(0, query.length - 4);
  if (query.substring(query.length - 6) === 'WHERE ')
    query = query.substr(0, query.length - 6);

  query += 'GROUP BY t."idTraining", d."deptName", d."regionName") sub';
  logger.info(' Controller getTraining QUERY [%s]', query);

  return sequelize
    .query(query, {
      model: Trainings,
      mapToModel: true,
      replacements: {
        diplomaLevel,
        admLevel,
        partTime,
        expertise: `%${  expertise  }%`,
        duration,
        dep,
        city: `%${  city  }%`,
        region: `%${  region  }%`,
      },
      type: sequelize.QueryTypes.SELECT,
    })
    .then(trainings => trainings);
};

const getTrainingById = (idTraining) => {
    logger.info(' [ Controller Training ]  getTrainingById %s', idTraining);
    return Trainings.findOne({
        where: { idTraining }
    }).then(training => {
        return training && !training.deletedAt
            ? training : Promise.reject(new Error('Unknown or deleted training'))}
    );
};

const updateAllScores = (idTraining) =>  {
    return Trainings.findOne({where :{ idTraining }})
        .then(training => {
            logger.info(' [ Controller Trainings ] checkLowestScore to do on training %s', training.idTraining);
            return checkLowestScore(training) })
        .then(training => {
            logger.info(' [ Controller Trainings ] checkHighestScore to do on training %s', training.idTraining);
            return checkHighestScore(training) })
        .then(training => {
            logger.info(' [  Controller Trainings ] updateAverageScore on training %s', training.idTraining);
            return updateAverageScore(training) })
        .then(training => training)
};

module.exports = {
  createTraining,
  getTrainings,
  checkLowestScore,
  checkHighestScore,
  updateAverageScore,
  getTrainingById,
  updateAllScores
};
