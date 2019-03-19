const express = require('express');

const apiAuth = express.Router();

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
                message: 'Authentication failed: wrong credentials',
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
  !req.body.email || !req.body.password
    ? res.status(400).send({
        success: false,
        message: 'email and password required',
      })
    : signup(req.body.email, req.body.password, req.body.metadata || null)
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
