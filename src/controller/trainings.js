/* eslint-disable linebreak-style */
const { Trainings, Depts } = require('../model');
const { logger } = require('../logger');
const Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres', 'postgres', 'password', {'dialect': 'postgresql'})

const createTraining = ({name, description, logoPath, admLevel, expertise, diplomaLevel, duration, partTime , link, school}) => {
    logger.info(' controller createTraining %s', name);
    return Trainings.create ({
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
        deptId: school.cp.substr(0,2),
        schoolDescription: school.description || ''
    }).then (training => {
        logger.info(' Controller adding admLevel to new training')
        training.addAdmissionLevels(admLevel)
        return training
    })
};

const getTrainings = ({admLevel, diplomaLevel, partTime, expertise, duration, dep, city }) => {
    logger.info(' Controller getTraining diplomaLevel ' + diplomaLevel);
    logger.info(' Controller getTraining admLevels %s', admLevel);

    return sequelize.query('SELECT * FROM "Trainings" LEFT JOIN "admLevels" a on "Trainings"."idTraining" = a."idTraining" WHERE "diplomaLevel" = :diplomaLevel AND  a."idLevel" IN (:admLevel)',
        {   model: Trainings,
            mapToModel: true,
            replacements: { diplomaLevel: diplomaLevel, admLevel: admLevel },
            type: sequelize.QueryTypes.SELECT
        }
        ).then(trainings => {
            logger.info(' Controller found training %s', trainings.idTraining)
            return trainings
    })
};


module.exports = {
    createTraining,
    getTrainings
};
