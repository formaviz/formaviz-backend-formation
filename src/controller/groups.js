const { Groups, Users } = require('../model');
const logger = require('../logger').logger;

const getAllGroups = () =>
  Groups.findAll({
    attributes: ['title', 'description'],
  }).then();

const createGroup = ({ title, description, metadatas }, user) =>
  Groups.create({
    title,
    description,
    metadatas: metadatas || '',
    owner_id: user.id,
  }).then();

const addMember = (groupId, userEmail, ownerUser) =>
  Users.findOne({
    where: { email: userEmail },
  }).then(user =>
    !user
      ? Promise.reject(new Error('UNKNOWN OR DELETED USER'))
      : Groups.findOne({
          where: {
            id: groupId,
          },
        }).then(group =>
          !group
            ? Promise.reject(new Error('UNKNONW OR DELETED GROUP'))
            : group.owner_id !== ownerUser.id
            ? Promise.reject(new Error('LOGGED USER IS NOT THE GROUP OWNER'))
            : group.addUsers(user)
        )
  );

const deleteMember = (groupId, userEmail, ownerUser) =>
  Users.findOne({
    where: { email: userEmail },
  }).then(user =>
    !user
      ? Promise.reject(new Error('UNKNOWN OR DELETED USER'))
      : Groups.findOne({
          where: {
            id: groupId,
          },
        }).then(group =>
          !group
            ? Promise.reject(new Error('UNKNONW OR DELETED GROUP'))
            : group.owner_id !== ownerUser.id
            ? Promise.reject(new Error('LOGGED USER IS NOT THE GROUP OWNER'))
            : !group.getUsers({ where: { id: user.id } })
            ? Promise.reject(new Error('USER IS NOT IN THE GROUP'))
            : group.removeUsers(user)
        )
  );

module.exports = { createGroup, getAllGroups, addMember, deleteMember };
