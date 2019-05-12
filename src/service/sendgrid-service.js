// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

const {logger} = require('../logger');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const supportEmail = process.env.SUPPORT_EMAIL;
const noReply = process.env.NO_REPLY_EMAIL;

const sendEmail = (to, bcc, subject, text, html) => {
  const msg = {
    to: `${to}`,
    bcc: Array.isArray(bcc) ? bcc : '',
    from: `${noReply}`,
    subject: `${subject}`,
    text: `${text}`,
    html: `${html}`,
  };
  sgMail.send(msg);
};

const rateMail = (name, city, event, comment, score) =>
  `La note de la formation ${name} ${city} vient d'être ${event}!\n"${comment}" -- ${score}/5`;

const sendRatingMail = (bcc, event, name, city, comment, score) => {
  logger.info('SEND RATING MAIL');
  sendEmail(supportEmail,
    bcc,
    `${name} ${city} : note ${event}`,
    rateMail(name, city, event),
    `<span>${rateMail(name, city, event, comment, score)}</span>`,
  );
};

const reportToSupport = involvedRoute => {
  sendEmail(
    supportEmail,
    null,
    'Error on server',
    `unable to contact ${involvedRoute}, please see logs to correct the problem.`,
    `<span>unable to contact <strong>${involvedRoute}</strong>, please see logs to correct the problem.</span>`
  );
};

module.exports = {
  sendEmail,
  sendRatingMail,
  rateMail,
  reportToSupport,
};
