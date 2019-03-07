/* eslint-disable linebreak-style */
const omit = require('lodash.omit');
const { Users } = require('../model');
const logger = require('../logger').logger;


const createUser = ({ firstName, lastName, email }) =>
    Users.create({
        email,
        firstName: firstName || '',
        lastName: lastName || ''
    }).then(user => { return user }
    );

const updateUser = ({idUser, firstName, lastName, email}) => {
    logger.info(" controller idUser %s ", idUser)

    return Users.findOne({
    where: {idUser}})
     .then(user => {
        if(firstName != null) user.firstName = firstName
        if(lastName != null) user.lastName = lastName
        if(email != null) user.email = email
        return Users.update({
            email : user.email,
            firstName: user.firstName,
            lastName: user.lastName,
        },{
            where: {idUser} ,
            returning : true,
            plain: true}
        ).then(user => {
            return user && !user.deletedAt
            ? omit(user,Users.all) : Promise.reject(new Error('UNKNOWN OR DELETED USER'))
        });
    });
}


const deleteUser = ({ idUser }) => {
  return Users.destroy({
    where: {idUser}}
  ).then(affectedRows => {
    logger.info(" %i rows deleted", affectedRows);
    return affectedRows === 1
      ? Promise.resolve("The user [id= %i] has been deleted", idUser)
      : Promise.reject(new Error('UNKNOWN OR DELETED USER'))
  });
}



const loginUser = ({ email }) =>
  Users.findOne({
    where: { email }
  }).then(user =>
    user && !user.deletedAt
      ? Promise.all([
          omit(
            user.get({
              plain: true
            })
          )
        ])
      : Promise.reject(new Error('UNKNOWN OR DELETED USER'))
  );

const getUser = ({ idUser }) =>
  Users.findOne({
    where: { idUser }
  }).then(user =>
    user && !user.deletedAt
      ? omit(
          user.get({
            plain: true
          })
        )
      : Promise.reject(new Error('UNKNOWN OR DELETED USER'))
  );

module.exports = {
  createUser,
  getUser,
  loginUser,
  updateUser,
  deleteUser
};
