const omit = require('lodash.omit');
const { Users } = require('../model');

const logger = require('../logger').logger;

const createUser = ({ firstName, lastName, email, password }) =>
  Users.create({
    email,
    firstName: firstName || '',
    lastName: lastName || '',
    hash: password,
  }).then(user =>
    omit(
      user.get({
        plain: true,
      }),
      Users.excludeAttributes
    )
  );

const loginUser = ({ email, password }) =>
  Users.findOne({
    where: {
      email,
    },
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
          omit(
            user.get({
              plain: true,
            }),
            Users.excludeAttributes
          ),
          user.comparePassword(password),
        ])
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const getUser = ({ id }) =>
  Users.findOne({
    where: {
      id,
    },
  }).then(user =>
    user && !user.deletedAt
      ? omit(
          user.get({
            plain: true,
          }),
          Users.excludeAttributes
        )
      : Promise.reject(new Error('UNKOWN OR DELETED USER'))
  );

const updateUser = (user, userId) =>
  Users.update(
    {
      firstName: user.firstName,
      lastName: user.lastName,
    },
    {
      returning: true,
      where: {
        id: userId,
      },
    }
  );

module.exports = {
  createUser,
  getUser,
  loginUser,
  updateUser,
};
