const {RecurrenceRule, scheduleJob} = require('node-schedule');
const {createMissingChannels} = require('./controller/trainings');
const app = require('./api/index');
const db = require('./model');
const {logger} = require('./logger');

const port = process.env.PORT || 8080;
const ip = process.env.IP || '0.0.0.0';
const rule = new RecurrenceRule();

db.sequelize
  .sync()
  .then(() =>
    app.listen(port, ip, err =>
      err
        ? logger.error(`🔥 Failed to start API : ${err.stack}`)
        : logger.info(`API is listening on port ${port}`)
    )
  )
  .catch(err => logger.error(`🔥 Failed to connect database : ${err.stack}`));

rule.minute = 23;
scheduleJob(rule, () => {
  createMissingChannels();
});