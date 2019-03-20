/* eslint-disable linebreak-style */
const express = require('express');
const { updateUser, deleteUser } = require('../controller/users');
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
    console.log('req.body ', req.body);
    console.log('req.query ', req.params);
  updateUser(req.body, req.params.idUser)
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

apiUsersProtected.delete('/:idUser', (req, res) => {
  logger.info('[API] id : %s ', req.params.idUser);
  const idUser = req.params.idUser;
  deleteUser({ idUser })
    .then(value => {
      logger.info(`[API] the user with id : ${  idUser  } has been deleted`);
      return res.status(200).send({
        success: true,
        return: value,
        message: 'user deleted',
      });
    })
    .catch(err => {
      logger.error(`💥 Failed to deleted user : ${err.stack}`);
      return res.status(500).send({
        success: false,
        message: `${err.name} : ${err.message}`,
      });
    });
});

module.exports = { apiUsers, apiUsersProtected };
