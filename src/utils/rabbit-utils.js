const uuidv4 = require('uuid/v4');
const {logger} = require('../logger');

/**
 * Allows to check if a queues exists
 * @param {*} channel
 * @param {*} queueName
 */
const checkQueue = (channel, queueName) =>
  channel.checkQueue(queueName, (ok, err) =>
    (err != null) ? Promise.reject(err) : Promise.resolve(true));

/**
 *
 * alllow to get a message and do an action.
 * @param {*} channel
 * @param {*} queueName
 * @param {Function} successCallback function which return an object
 * @param {boolean} rpc
 * @param {*} parameter {noAck: true} for example it's parameters RABBITMQ
 */
const consume = (channel, queueName, successCallback, rpc, parameter, parameterCallBack) =>
  checkQueue(channel, queueName)
    .then(() => {
      if (rpc) {
        // allows to process one message at a time
        channel.prefetch(1);
      }
      return channel.consume(queueName, (msg) => {
        logger.info('[CONSUMER][', queueName, '] waiting to consume a message ', msg.content.toString());
        // execute callback
        const result = successCallback(msg, parameterCallBack);
        if (rpc) {
          result.then((res) => {
            // send result to producer
            channel.sendToQueue(msg.properties.replyTo,
              Buffer.from(JSON.stringify(res)), {correlationId: msg.properties.correlationId});
            // allows to infom to channel that the message has been treated
            channel.ack(msg);
          });
        }
      }, parameter);
    })
    .catch((err) => logger.error('[CONSUME-RABBIT](ERR) : \n', err));

/**
 *
 * @param {object} channel
 * @param {string} queueName
 * @param {object} message
 * @param {object} parameter to send a message (for example { correlationId : corr, replyTo : q.queue}) for example
 */
const sender = (channel, queueName, message, parameter) =>
  new Promise(() =>
    channel.checkQueue(queueName, (err, ok) =>
      (err != null) ? Promise.reject(err) : Promise.resolve(true))
      .then(() => {
        logger.info('[SENDER] send message');
        logger.debug(queueName);
        logger.debug(message);
        return channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), parameter);
      }))
    .catch((err) => logger.error('don\'t sent :', err));

/**
 * allows to send a message to our api via rpc pattern
 * @param {*} conn
 * @param {*} channel
 * @param {*} queueName
 * @param {*} message
 * @param {*} successCallback function to apply if the message has been treated and that the consumer has send a message return
 * @param {*} replyToQueue
 */
const rpcProducer = (conn, channel, queueName, message, successCallback, replyToQueue = 'rcpQueue') => {
  channel.assertQueue(replyToQueue, {}).then(() => {
    // generate an uuid to identify the request
    const corr = uuidv4();
    consume(channel, replyToQueue, (msg) => {
      if (msg.properties != null && msg.properties.correlationId === corr) {
        logger.info('[RPC-CONSUMER] message return with uuid', corr);
        successCallback(msg);
      }
      setTimeout(() => {
        conn.close();
      }, 5000);
    }, false, {noAck: true});
    sender(channel, queueName, message, {correlationId: corr, replyTo: replyToQueue});
  });
};
/**
 * allows to get a message with rpc pattern
 * @param {*} channel
 * @param {String} queueName
 * @param {Function} successCallback
 * @param {Array} parameter for the function callback
 */
const rpcConsumer = (channel, queueName, successCallback, parameterCallBack) => {
  logger.info('[RPC-CONSUMER][', queueName, '] waiting to consume a message ');
  return consume(channel, queueName, successCallback, true, {}, parameterCallBack);
};

module.exports = {consume, sender, rpcConsumer, rpcProducer};