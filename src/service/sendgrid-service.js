// using SendGrid's v3 Node.js Library
// https://github.com/sendgrid/sendgrid-nodejs
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (to, bcc, from, subject, text, html) => {
  const msg = {
    to: `${to}`,
    bcc: Array.isArray(bcc) ? bcc : '',
    from: `${from}`,
    subject: `${subject}`,
    text: `${text}`,
    html: `${html}`,
  };
  sgMail.send(msg);
};

module.exports = {
  sendEmail,
};