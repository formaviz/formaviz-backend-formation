const express = require('express');
const bodyParser = require('body-parser');
const hpp = require('hpp');
const helmet = require('helmet');
const expressPino = require('../logger');
const { apiUsers, apiUsersProtected } = require('./users');
const { apiGroups, apiGroupsProtected } = require('./groups');
const { isAuthenticated, initAuth } = require('../controller/auth');

const api = express();
initAuth();

api.use(express.json({ limit: '1mb' }));
const apiRoutes = express.Router();

api.use(bodyParser.urlencoded());
api.use(hpp);
api.use(helmet());
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
  .use('/groups', apiGroups)
  .use(isAuthenticated)
  .use('/groups', apiGroupsProtected)
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
