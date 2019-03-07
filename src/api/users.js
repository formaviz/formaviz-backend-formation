/* eslint-disable linebreak-style */
const express = require('express');
const jwt = require('jwt-simple');
const { createUser, loginUser , updateUser , deleteUser} = require('../controller/users');
const logger = require('../logger').logger;

const apiUsers = express.Router();

// http://apidocjs.com/#params
/**
 * @api {post} /users User account creation
 * @apiVersion 1.0.0
 * @apiName createUser
 * @apiGroup Users
 *
 * @apiParam {STRING} email Email of the User.
 * @apiParam {STRING} [firstName] First name of the User.
 * @apiParam {STRING} [lastName] Last name of the User.
 *
 * @apiSuccess {BOOLEAN} success Success.
 * @apiSuccess {STRING} message Message.
 * @apiSuccess {JSON} profile Profile informations about the User.
 */
apiUsers.post('/', (req, res) => {
    logger.info(' received request to create user %s %s ', req.body.firstName, req.body.lastName)
        !req.body.email
            ? res.status(400).send({
                success: false,
                message: 'email is required'
            })
            : createUser(req.body)
                .then(user => {
                    logger.info(' api user successfully created %s %s', user.firstName, user.idUser);

                    return res.status(201).send({
                        success: true,
                        profile: user,
                        message: 'user created'
                    });
                })
                .catch(err => {
                    logger.error(`💥 Failed to create user : ${err.stack}`);
                    return res.status(500).send({
                        success: false,
                        message: `${err.name} : ${err.message}`
                    });
                });
        }
);

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
        message: 'email is required'
      })
    : loginUser(req.body)
        .then(user => {
          const token = jwt.encode({ id: user.id }, process.env.JWT_SECRET);
          return res.status(200).send({
            success: true,
            token: `JWT ${token}`,
            profile: user,
            message: 'user logged in'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to login user : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        })
);

const apiUsersProtected = express.Router();
apiUsersProtected.get('/', (req, res) =>
  res.status(200).send({
    success: true,
    profile: req.user,
    message: 'user logged in'
  })
);

apiUsersProtected.put('/:idUser', (req, res) => {
  req.body.idUser = req.params.idUser;
      updateUser(req.body)
        .then(user => {
          return res.status(201).send({
            success: true,
            profile: user,
            message: 'user updated'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to update user : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        });
      }
);

apiUsersProtected.delete('/', (req, res) => {
    logger.info("[API] id : %s ",req.user.idUser)
    const id = req.user.idUser
    deleteUser({id})
        .then((value) => {
          logger.info("[API] the user with id : %s has been deleted", id);
          return res.status(200).send({
            success: true,
            return: value,
            message: 'user deleted'
          });
        })
        .catch(err => {
          logger.error(`💥 Failed to deleted user : ${err.stack}`);
          return res.status(500).send({
            success: false,
            message: `${err.name} : ${err.message}`
          });
        });
      }
    );

module.exports = { apiUsers, apiUsersProtected };
