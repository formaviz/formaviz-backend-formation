const express = require('express');

const api = express();
api.use(express.json({ limit: '1mb' }));
const apiRoutes = express.Router();
apiRoutes.get('/', (req, res) =>
  res.status(200).send({ message: 'Hello from my awesome api !' })
);

api.use('/api/v1', apiRoutes);
module.exports = api;
