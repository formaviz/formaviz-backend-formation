const amqp = require('amqp');
const RABBIT_MQ = process.env.RABBIT_MQ;

const {logger} = require('../logger');

const connection = amqp.createConnection({url: RABBIT_MQ});

connection.on('error', (error) =>
  logger.error(error));

connection.on('ready', () => {
  connection.queue('rpcQueue', (queue) => {
    queue.bind('#');
    queue.subscribe(message => logger.debug(message));
  })
});