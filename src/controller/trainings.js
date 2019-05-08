/* eslint-disable linebreak-style */
const {createMessage, sendTrainingMessage} = require('../service/rabbit-sender');
const {logger} = require('../logger');
const {Trainings} = require('../model');
const {validateSchema} = require('../service/json-validator');
const {RABBIT_TRAINING_SCHEMA} = require('../schema/training');

const db = require('../model/index');

const {sequelize} = db;

const addChannelToTraining = (msg, idTraining) => {
  logger.info('addChannelToTraining was called');
  const content = JSON.parse(msg.content.toString());
  const valid = validateSchema(RABBIT_TRAINING_SCHEMA, content);

  if (valid.valid) {
    Trainings.update({
      chanCreated: true,
      channelUri: content.message.url
    }, {
      where: {idTraining}
    })
      .then(() => Promise.resolve());
  }
  logger.info(valid);
};

const createChannel = (name, city, idTraining, user) => {
  const rabbitMsg = createMessage(
    'CREATE_FORMATION',
    `${name}_${city}`,
    idTraining,
    user);
  sendTrainingMessage(rabbitMsg, idTraining, addChannelToTraining);
};

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
                        }, user) => {
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
    createChannel(name, school.city, training.idTraining, user);
    training.addAdmissionLevels(admLevel);
    return training;
  });
};

const checkLowestScore = (training) => {
  logger.info(' [ Controller ] check Lowest Score for training %s', training.idTraining);

  const query = 'UPDATE "Trainings" t set "lowestScore"=(SELECT min("score") FROM "Ratings" r WHERE  r."trainingId" = ? AND r."deletedAt" IS NULL) WHERE t."idTraining"= ? RETURNING *';
  return sequelize
    .query(query, {
      replacements: [training.idTraining, training.idTraining],
      type: sequelize.QueryTypes.UPDATE,
      raw: true,
    })
    .then(result => {
      logger.info(' [ Controller Trainings ] lowest score %s', result[0][0].lowestScore);
      return result[0][0];
    });
};

const checkHighestScore = (training) => {
  logger.info(' [ Controller ] check Highest Score for training %s', training.idTraining);
  const query = 'UPDATE "Trainings" t set "highestScore"=(SELECT max("score") FROM "Ratings" r WHERE  r."trainingId" = ? AND r."deletedAt" IS NULL) WHERE t."idTraining"= ? RETURNING *';
  return sequelize
    .query(query, {
      replacements: [training.idTraining, training.idTraining],
      type: sequelize.QueryTypes.UPDATE,
      raw: true,
    })
    .then(result => {
      logger.info(' [ Controller Trainings ] highest score %s', result[0][0].lowestScore);
      return result[0][0];
    });
};

const updateAverageScore = (training) => {
  logger.info(' [ Controller ] update average score for training %s', training.idTraining);

  const query = 'SELECT AVG (score) FROM "Ratings" WHERE "trainingId" = ? AND "deletedAt" IS NULL';
  return sequelize.query(query, {
    replacements: [training.idTraining],
    type: sequelize.QueryTypes.SELECT,
    raw: true,
  })
    .then(result => {
      logger.info(' [ Controller ] computed average score %s', result[0].avg);
      Trainings.update(
        {
          averageScore: result[0].avg,
        },
        {where: {idTraining: training.idTraining}}
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
        expertise: `%${expertise}%`,
        duration,
        dep,
        city: `%${city}%`,
        region: `%${region}%`,
      },
      type: sequelize.QueryTypes.SELECT,
    })
    .then(trainings => trainings);
};

const getTrainingById = (idTraining) => {
  logger.info(' [ Controller Training ]  getTrainingById %s', idTraining);
  return Trainings.findOne({
    where: {idTraining}
  }).then(training => {
      return training && !training.deletedAt
        ? training : Promise.reject(new Error('Unknown or deleted training'));
    }
  );
};

const updateAllScores = (idTraining) =>
  Trainings.findOne({where: {idTraining}})
    .then(training => {
      logger.info(' [ Controller Trainings ] checkLowestScore to do on training %s', training.idTraining);
      return checkLowestScore(training);
    })
    .then(training => {
      logger.info(' [ Controller Trainings ] checkHighestScore to do on training %s', training.idTraining);
      return checkHighestScore(training);
    })
    .then(training => {
      logger.info(' [  Controller Trainings ] updateAverageScore on training %s', training.idTraining);
      return updateAverageScore(training);
    })
    .then(training => training);

const getTrainingWithoutChannel = () => Trainings.findAll({where: {chanCreated: false}});

const createMissingChannels = () => {
  logger.info(' [  Controller Trainings ] creating missing channels')
  getTrainingWithoutChannel().then(channels => {
    channels.forEach(c => createChannel(c.name, c.schoolCity, c.idTraining, 'system'))
  }).catch(error => logger.error(' [  Controller Trainings ] Error while creating missing channels', error));
};

module.exports = {
  createTraining,
  getTrainings,
  checkLowestScore,
  checkHighestScore,
  updateAverageScore,
  getTrainingById,
  updateAllScores,
  createMissingChannels
};
