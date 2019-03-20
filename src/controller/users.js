/* eslint-disable linebreak-style */
const omit = require('lodash.omit');
const { Users } = require('../model');
const { logger } = require('../logger');

const createUser = (idUser, firstName, lastName, email, role) =>
  Users.create({
    idUser,
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    role: role || 'PROSPECT',
  }).then(user => user);


const updateUser = ({ firstName, lastName, email, role }, idUser) => {
  logger.info(' [ Controller Users ] idUser %s ', idUser);

    return Users.update(
      {
        email: email || '',
        firstName: firstName || '',
        lastName: lastName || '',
        role: role || '',
      },
      {
        where: { idUser },
        returning: true,
        plain: true,
      }
    ).then(user => user && !user.deletedAt
        ? omit(user, Users.all)
        : Promise.reject(new Error('Unknown or deleted user')));
};

const deleteUser = ({ idUser }) => {
  logger.info(' [ Controller Users ] deleting idUser %s ', idUser);
  return Users.destroy({
    where: { idUser },
  }).then(affectedRows => {
    logger.info(' %s rows deleted', affectedRows);
    return affectedRows === 1
      ? Promise.resolve(`The user id ${  idUser  } has been deleted`)
      : Promise.reject(new Error('Unknown or deleted user '));
  });
};



const getUser = ( idUser ) => {
    logger.info(' [ Controller Users ] getUser with id %s ', idUser);
    return Users.findOne({
        where: {idUser},
    }).then(user =>
        user && !user.deletedAt
            ? omit(
            user.get({
                plain: true,
            })
            )
            : Promise.reject(new Error('Unknown or deleted user'))
    );
};

module.exports = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
