const express = require('express');
const session = require('express-session');
const { passport } = require('../controller/auth');
const bodyParser = require('body-parser');
const expressPino = require('../logger');

const apiAuth = require('./auth');

const app = express();

const sess = {
  secret: 'I AM VERY SECRET',
  cookie: {},
  resave: false,
  saveUninitialized: true,
};

if (app.get('env') === 'production') {
  sess.cookie.secure = true; // serve secure cookies, requires https
}

app.use(session(sess));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json({ limit: '1mb' }));
const apiRoutes = express.Router();

app.use(bodyParser.urlencoded());
app.use(expressPino);

apiRoutes.use((req, res, next) => {
  req.log.info();
  next();
});

apiRoutes.get('/', (req, res) => {
  res.status(200).send({ message: 'Hello from my awesome app !' });
});

apiRoutes.use((err, req, res, next) => {
  res.status(403).send({
    success: false,
    message: `${err.name} : ${err.message}`,
  });
  next();
});

app.use('/api/v1', apiRoutes).use('/api/v1', apiAuth);
module.exports = app;
