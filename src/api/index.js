const express = require('express');
const expressPino = require('../logger');
const { apiUsers, apiUsersProtected } = require('./users');
const { isAuthenticated, initAuth } = require('../controller/auth');

const api = express();
initAuth();

api.use(express.json({ limit: '1mb' }));
const apiRoutes = express.Router();

api.use(expressPino);

apiRoutes.use((req, res, next) => {
  req.log.info();
  next();
});

apiRoutes.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello from my awesome api !' });
});

apiRoutes
  .use('/users', apiUsers)
  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

api.use('/api/v1', apiRoutes);
module.exports = api;
