const { Groups } = require('../model');
const logger = require('../logger').logger;

const createGroup = ({ title, description, metadatas }, user) =>
  Groups.create({
    title,
    description: description || '',
    metadatas: metadatas || '',
    owner_id: user.id,
  })
    .then()
    .catch(err => {
      logger.error(err);
    });

module.exports = { createGroup };
