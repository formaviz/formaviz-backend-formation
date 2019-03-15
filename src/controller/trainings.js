/* eslint-disable linebreak-style */
const { Trainings, Depts } = require('../model');
const { logger } = require('../logger');

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
        training.addLevels(admLevel)
        return training
    })
};

const getTrainings = ({admLevel, diplomaLevel, partTime, expertise, duration, dep, city }) => {
    logger.info(' controller getTraining diplomaLevel ' + diplomaLevel);
    logger.info(' controller getTraining admLevel %s', admLevel);
    return Trainings.findAll({
        // include: [{
        //     model: Depts,
        //     where: {
        //         idRegion: region
        //     }
        // }],
        where : {
            admLevel: [admLevel],
            diplomaLevel: [diplomaLevel],
            partTime: [partTime],
            expertise: [expertise],
            duration: [duration],
            deptId: [dep],
            schoolCity: [city]
        }
    }).then(trainings => trainings)
};


module.exports = {
    createTraining,
    getTrainings
};
