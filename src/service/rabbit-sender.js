const amqp = require('amqplib');

const {AMQP_RATING_QUEUE, AMQP_TRAINING_QUEUE, AMQP_USER_QUEUE, RABBIT_MQ} = process.env;

const {logger} = require('../logger');

const {rpcProducer} = require('../utils/rabbit-utils');

const createMessage = (eventType, name, idTraining, user) =>
  Object({
    eventType,
    data: {
      email: user.email,
      name,
      idTraining,
      username: user.nickname,
    }
  });

const sendTrainingMessage = (message, idTraining, callback) =>
  amqp.connect(RABBIT_MQ)
    .then((conn) => {
      conn.createChannel().then((channel) => {
        rpcProducer(
          conn,
          channel,
          AMQP_TRAINING_QUEUE,
          message,
          (msg) => callback(msg, idTraining),
          'amq.rabbitmq.reply-to'
      );
      });
    });

const sendRatingMessage = (message) => {
  amqp.connect(RABBIT_MQ)
    .then((conn) => {
      conn.createChannel().then((channel) => {
        rpcProducer(conn, channel, AMQP_RATING_QUEUE, message, (msg) => logger.info(msg));
      });
    });
};

const sendNewRaterMessage = (message) => {
  amqp.connect(RABBIT_MQ)
    .then((conn) => {
      conn.createChannel().then((channel) => {
        rpcProducer(conn, channel, AMQP_USER_QUEUE, message, (msg) => logger.info(msg));
      });
    });
};

module.exports = {createMessage, sendTrainingMessage, sendRatingMessage, sendNewRaterMessage};
