const express = require('express');

const {createUser} = require('../controller/users');
const {validateSchema, USER_CREATION_SCHEMA} = require('../service/json-validator');
const {login, signup} = require('../controller/auth');
const {logger} = require('../logger');

const apiAuth = express.Router();

apiAuth.post('/login', (req, res) =>
  !req.body.email || !req.body.password
    ? res.status(400).send({
      success: false,
      message: 'email and password required',
    })
    : login(req.body.email, req.body.password)
    .then(accessToken => accessToken
      ? res.status(201).send({
        success: true,
        access_token: accessToken,
      })
      : res.status(401).send({
        success: false,
        message: `Authentication failed: wrong credentials: ${accessToken}`,
      }))
    .catch(err => {
      logger.error(`Unable to process authentication: ${err}`);
      return res.status(500).send({
        success: false,
        message: err,
      });
    })
);


apiAuth.post('/signup', (req, res) => {
  logger.info(' [ Api Auth ] attempting to sign user %s up ', req.body.email);
  const valid = validateSchema(USER_CREATION_SCHEMA, req.body);
  if (!valid.valid) {
    logger.warn(' Request for signup does not validate JSON schema');
    return res.status(400).send(valid.erros);
  }

  return signup(req.body.email, req.body.password, req.body.metadata || null)
    .then(response => {
      logger.debug('response from Auth0 : ', response);
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
