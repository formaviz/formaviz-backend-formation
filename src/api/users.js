/* eslint-disable linebreak-style */
const express = require('express');
const jwt = require('jwt-simple');
const { loginUser, updateUser, deleteUser } = require('../controller/users');
const { logger } = require('../logger');

const apiUsers = express.Router();


/**
 * @api {post} /users/login User login
 * @apiVersion 1.0.0
 * @apiName loginUser
 * @apiGroup Users
 *
 * @apiParam {STRING} email Email of the User.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {STRING} token JWT token.
 * @apiSuccess {JSON} profile Profile informations about the User.
 */
apiUsers.post('/login', (req, res) =>
  !req.body.email
    ? res.status(400).send({
        success: false,
        message: 'email is required',
      })
    : loginUser(req.body)
        .then(user => {
          const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
          return res.status(200).send({
            success: true,
            token: `JWT ${token}`,
            profile: user,
            message: 'user logged in',
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to login user : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`,
          });
        })
);

const apiUsersProtected = express.Router();
apiUsersProtected.get('/', (req, res) =>
  res.status(200).send({
    success: true,
    profile: req.user,
    message: 'user logged in',
  })
);

apiUsersProtected.put('/:idUser', (req, res) => {
  req.body.idUser = req.params.idUser;
  updateUser(req.body)
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
