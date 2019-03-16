/* eslint-disable linebreak-style */
const express = require('express');

const bodyParser = require('body-parser');
const expressPino = require('../logger');

const { checkJwt } = require('../controller/auth');
const apiAuth = require('./auth');
const { apiUsers, apiUsersProtected } = require('./users');
const { apiTrainings } = require('./trainings');
const { apiRatings } = require('./ratings');

const app = express();

app.use(express.json({ limit: '1mb' }));
const apiRoutes = express.Router();

app.use(bodyParser.urlencoded());
app.use(expressPino);

apiRoutes.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello from my awesome app !' });
});

apiRoutes
  .get('/', (req, res) => res.status(200).send({ message: 'Hello from my awesome app !' }))
  .use('/users', apiUsers)
  // api bellow this middelware require Authorization
  //  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use('/trainings', apiTrainings)
  .use('/rates', apiRatings)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

apiRoutes.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello from formaviz api !' });
});

/* Example of protected route, just use checkJwt middleware */
apiRoutes.get('/private', checkJwt, (req, res) => {
  res.status(200).send({ message: 'Your token is valid :-)' });
});


apiRoutes.use((err, req, res, next) => {
  res.status(403).send({
    success: false,
    message: `${err.name} : ${err.message}`,
  });
  next();
});

apiRoutes.use(apiAuth);

app.use('/api/v1', apiRoutes).use('/api/v1', apiAuth);
module.exports = app;
