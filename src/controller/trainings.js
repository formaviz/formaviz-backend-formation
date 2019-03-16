/* eslint-disable linebreak-style */
const { Trainings } = require('../model');
const { logger } = require('../logger');
const Sequelize = require('sequelize');
var sequelize = new Sequelize('postgres', 'postgres', 'password', {'dialect': 'postgresql'})

const createTraining = ({name, description, logoPath, admLevel, expertise, diplomaLevel, duration, partTime , link, school}) => {
    logger.info(' [ Controller ] createTraining %s', name);
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


const getTrainings = ({admLevel, diplomaLevel, partTime, expertise, duration, dep, city, region }) => {
    logger.info(' [ Controller ]  getTraining()' );

    let query = 'SELECT to_json(sub) AS training FROM  (SELECT t.*, d."deptName", d."regionName", json_agg(l."grade") AS "admLevels", (SELECT l."grade" FROM "Levels" l WHERE l."idLevel" = t."diplomaLevel") as "diplomaName" FROM "Trainings" t LEFT JOIN "admLevels" a on t."idTraining" = a."idTraining" LEFT JOIN "Levels" l on a."idLevel" = l."idLevel" LEFT JOIN "Depts" d on t."deptId" = d."idDept" WHERE ';

    if (admLevel) query += 'a."idLevel" IN (:admLevel) AND ';
    if (diplomaLevel) query += '"diplomaLevel" = :diplomaLevel AND ';
    if (partTime) query += '"partTime" = :partTime AND ';
    if (expertise) query += 'LOWER("expertise") LIKE LOWER(:expertise) AND ';
    if (duration) query += '"duration" = :duration AND ';
    if (dep) query += '"deptId" = :dep AND ';
    if (city) query += 'LOWER("schoolCity") LIKE LOWER(:city) AND ';
    if (region) query += 'LOWER(d."regionName") LIKE LOWER(:region) ';

    if (query.substring(query.length -4) === 'AND ') query = query.substr(0, query.length - 4);

    query += 'GROUP BY t."idTraining", d."deptName", d."regionName") sub'
    logger.info(' Controller getTraining QUERY [%s]', query);

    return sequelize.query(query,
        {   model: Trainings,
            mapToModel: true,
            replacements: {
                diplomaLevel: diplomaLevel,
                admLevel: admLevel,
                partTime: partTime,
                expertise: '%'+expertise+'%',
                duration: duration,
                dep: dep,
                city: '%'+city+'%',
                region: '%'+region+'%'
            },
            type: sequelize.QueryTypes.SELECT
        }
        ).then(trainings => {
            return trainings
    })
};


module.exports = {
    createTraining,
    getTrainings
};
