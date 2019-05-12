/* eslint-disable linebreak-style */
const express = require('express');
const { updateUser, deleteUser } = require('../controller/users');
const {validateSchema, USER_UPDATE_SCHEMA } = require('../service/json-validator');
const { checkJwt, getUser } = require('../controller/auth');
const { logger } = require('../logger');

const apiUsers = express.Router();


const apiUsersProtected = express.Router();
apiUsersProtected.get('/', [checkJwt, getUser], (req, res) =>
  res.status(200).send({
    success: true,
    profile: req.user,
    message: 'user logged in',
  })
);

apiUsersProtected.patch('/:idUser', [checkJwt, getUser], (req, res) => {
    logger.info(' [ Api Users ] Updating user %s', req.body.firstName);
    const valid = validateSchema(USER_UPDATE_SCHEMA, req.body);
    if (!valid.valid) {
        logger.warn(' Request for update does not validate JSON schema');
        return res.status(400).send(valid.erros);
    }
  return updateUser(req.body, req.params.idUser)
    .then(user => res.status(201).send({
        success: true,
        profile: user,
        message: 'user updated',
      }))
    .catch(err => {
      logger.error(`💥 Failed to update user : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    });
});

// apiUsersProtected.delete('/:idUser', (req, res) => {
//   logger.info('[Api Users] Deleting user : %s ', req.params.idUser);
//   deleteUser( req.params.idUser )
//     .then(value => {
//       logger.info(`[Api Users ] the user with id : ${  idUser  } has been deleted`);
//       return res.status(200).send({
//         success: true,
//         return: value,
//         message: 'user deleted',
//       });
//     })
//     .catch(err => {
//       logger.error(`💥 Failed to deleted user : ${err.stack}`);
//       return res.status(500).send({
//         success: false,
//         message: `${err.name} : ${err.message}`,
//       });
//     });
// });

module.exports = { apiUsers, apiUsersProtected };
