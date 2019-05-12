/* eslint-disable linebreak-style */
const express = require('express');

const bodyParser = require('body-parser');
const cors = require('cors');
const expressPino = require('../logger');

const { checkJwt, getUser } = require('../controller/auth');
const apiAuth = require('./auth');
const { apiUsers, apiUsersProtected } = require('./users');
const { apiTrainings } = require('./trainings');
const { apiRatings } = require('./ratings');
const { apiLevels } = require('./levels');
const { apiDepts } = require('./depts');

const app = express();

app.use(express.json({ limit: '1mb' }));
const apiRoutes = express.Router();

app.use(bodyParser.urlencoded());
app.use(cors());
app.use(expressPino);

// upgrade to https if requested on http
app.get('*', (req, res, next) => !req.secure && process.env.NODE_ENV === 'production'
    ? res.redirect(308, `https://${req.headers.host}${req.originalUrl}`)
    : next());

apiRoutes.use((req, res, next) => {
  req.log.info();
  next();
});

apiRoutes.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello from formaviz api ! tesssssssst' });
});

/* Example of protected route, just use checkJwt middleware */
apiRoutes.get('/private', [checkJwt, getUser], (req, res) => {
  res.status(200).send({ message: 'Your token is valid :-)', res: req.user });
});

apiRoutes
  .use('/users', apiUsers)
  // api bellow this middelware require Authorization
  //  .use(isAuthenticated)
  .use('/users', apiUsersProtected)
  .use('/trainings', apiTrainings)
  .use('/rates', apiRatings)
  .use('/levels', apiLevels)
  .use('/depts', apiDepts)
  .use((err, req, res, next) => {
    res.status(403).send({
      success: false,
      message: `${err.name} : ${err.message}`,
    });
    next();
  });

apiRoutes.use((err, req, res, next) => {
  res.status(403).send({
    success: false,
    message: `${err.name} : ${err.message}`,
  });
  next();
});

apiRoutes.use(apiAuth);
app.use('/api/v1', apiRoutes);

module.exports = app;
