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
    role: role || 'EVAL',
  }).then(user => user);

const updateUser = ({ idUser, firstName, lastName, email }) => {
  logger.info(' controller idUser %s ', idUser);

  return Users.findOne({
    where: { idUser },
  }).then(user => {
    if (firstName != null) user.firstName = firstName;
    if (lastName != null) user.lastName = lastName;
    if (email != null) user.email = email;
    return Users.update(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      {
        where: { idUser },
        returning: true,
        plain: true,
      }
    ).then(user => user && !user.deletedAt
        ? omit(user, Users.all)
        : Promise.reject(new Error('UNKNOWN OR DELETED USER')));
  });
};

const deleteUser = ({ idUser }) => {
  logger.info(' controller deleting idUser %s ', idUser);
  return Users.destroy({
    where: { idUser },
  }).then(affectedRows => {
    logger.info(' %s rows deleted', affectedRows);
    return affectedRows === 1
      ? Promise.resolve(`The user id ${  idUser  } has been deleted`)
      : Promise.reject(new Error('UNKNOWN OR DELETED USER'));
  });
};

const loginUser = ({ email }) =>
  Users.findOne({
    where: { email },
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
          omit(
            user.get({
              plain: true,
            })
          ),
        ])
      : Promise.reject(new Error('UNKNOWN OR DELETED USER'))
  );

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
  loginUser,
  updateUser,
  deleteUser,
};
