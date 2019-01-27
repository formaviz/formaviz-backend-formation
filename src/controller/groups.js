const { Groups } = require('../model');
const logger = require('../logger').logger;

const createGroup = ({ title, description, metadatas }, user) =>
  Groups.create({
    title,
    description,
    metadatas: metadatas || '',
    owner_id: user.id
  }).then();

const getAllGroups = () =>
  Groups.findAll({
    attributes: ['title', 'description']
  }).then();

module.exports = { createGroup, getAllGroups };
