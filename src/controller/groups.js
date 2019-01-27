const { Groups, Users } = require('../model');
const logger = require('../logger').logger;

const getAllGroups = () =>
  Groups.findAll({
    attributes: ['title', 'description']
  }).then();

const createGroup = ({ title, description, metadatas }, user) =>
  Groups.create({
    title,
    description,
    metadatas: metadatas || '',
    owner_id: user.id
  }).then();

const addMember = (groupTitle, userEmail, ownerId) =>
  Users.findOne({
    where: { email: userEmail }
  }).then(user =>
    !user
      ? Promise.reject(new Error('UNKNOWN OR DELETED USER'))
      : Groups.findOne({
          where: {
            title: groupTitle
          }
        }).then(group =>
          !group
            ? Promise.reject(new Error('UNKNONW OR DELETED GROUP'))
            : group.owner_id !== ownerId
            ? Promise.reject(new Error('LOGGED USER IS NOT THE GROUP OWNER'))
            : group.addUsers(user).then(group.save)
        )
  );

module.exports = { createGroup, getAllGroups, addMember };
