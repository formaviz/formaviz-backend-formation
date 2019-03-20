const express = require('express');

const apiAuth = express.Router();
const { createUser } = require('../controller/users');
const {validateSchema, USER_CREATION_SCHEMA,} = require('../service/json-validator');
const { login, signup } = require('../controller/auth');
const { logger } = require('../logger');

apiAuth.post('/login', (req, res) => {
  !req.body.email || !req.body.password
    ? res.status(400).send({
        success: false,
        message: 'email and password required',
      })
    : login(req.body.email, req.body.password)
        .then(access_token => access_token
            ? res.status(201).send({
                success: true,
                access_token,
              })
            : res.status(401).send({
                success: false,
                message: 'Authentication failed: wrong credentials: ' + access_token,
              }))
        .catch(err => {
          logger.error(`Unable to process authentication: ${err}`);
          return res.status(500).send({
            success: false,
            message: err,
          });
        });
});


apiAuth.post('/signup', (req, res) => {
    logger.info(' [ Api Auth ] attempting to sign user %s up ', req.body.email);
    const valid = validateSchema(USER_CREATION_SCHEMA, req.body);
    return !valid.valid
        ? res.status(400).send({
            success: false,
            message: valid.erros,
        })
    : signup(req.body.email, req.body.password, req.body.metadata || null)
          .then(response => {
              console.log('response from Auth0 : ', response);
              logger.info(' [ Api Auth ] User successfully authenticated ', req.body.email);
              return createUser(response.user_id, req.body.firstName, req.body.lastName, response.email, req.body.role);
          })
        .then(response => response.error || response.statusCode === 400
            ? res.status(400).send(response)
            : res.status(200).send(response))
        .catch(err => {
          logger.error(`Unable to process signup: ${err}`);
          return res.status(500).send({
            success: false,
            message: err,
          });
        });
});

module.exports = apiAuth;
