const omit = require("lodash.omit");
const { Users } = require("../model");

const logger = require("../logger").logger;

const createUser = ({ firstName, lastName, email, password }) =>
  Users.create({
    email,
    firstName: firstName || "",
    lastName: lastName || "",
    hash: password
  }).then(user =>
    omit(
      user.get({
        plain: true
      }),
      Users.excludeAttributes
    )
  );

const loginUser = ({ email, password }) =>
  Users.findOne({
    where: {
      email
    }
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
          omit(
            user.get({
              plain: true
            }),
            Users.excludeAttributes
          ),
          user.comparePassword(password)
        ])
      : Promise.reject(new Error("UNKOWN OR DELETED USER"))
  );

const getUser = ({ id }) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
          user.get({
            plain: true
          }),
          Users.excludeAttributes
        )
      : Promise.reject(new Error("UNKOWN OR DELETED USER"))
  );

const updateUser = ({ firstName, lastName, email }, id) =>
  Users.findOne({
    where: {
      id
    }
  }).then(user => {
    if (firstName != null) user.firstName = firstName;
    if (lastName != null) user.lastName = lastName;
    if (email != null) user.email = email;
    // if (password != null) user.password = password;
    return Users.update(
      {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
        // hash: user.password
      },
      {
        where: { id },
        returning: true,
        plain: true
      }
    ).then(user =>
      user && !user.deletedAt
        ? omit(user, Users.all)
        : Promise.reject(new Error("UNKOWN OR DELETED USER"))
    );
  });

module.exports = {
  createUser,
  getUser,
  loginUser,
  updateUser
};
