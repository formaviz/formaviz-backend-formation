/* eslint-disable linebreak-style */
const { Trainings } = require('../model');
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
    })};


module.exports = {
    createTraining
};
