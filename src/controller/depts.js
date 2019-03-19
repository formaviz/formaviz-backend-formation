const { Depts } = require('../model');
const { logger } = require('../logger');

const getAllDepts = () => {
  logger.info(' [ Depts Api ] retrieving all Depts ');
  return Depts.findAll({
    attributes: ['idDept', 'deptName', 'idRegion', 'regionName'],
    where: {
      deletedAt: null,
    },
  });
};

module.exports = {
  getAllDepts,
};
