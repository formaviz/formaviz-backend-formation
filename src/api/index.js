const express = require('express');
const expressPino = require('../logger');

const api = express();
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

api.use('/api/v1', apiRoutes);
module.exports = api;
