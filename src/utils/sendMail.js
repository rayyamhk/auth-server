const nodemailer = require('nodemailer');

let transporter;

// test accounts generated here https://ethereal.email/
// all email will be catched by ethereal.email
const HOST = 'smtp.ethereal.email',
      PORT = 587,
      USER = 'zula32@ethereal.email',
      PASSWORD = 'kA9EjcmjJQuGakv8GY',
      SENDER_NAME = 'Zula Becker';

function init() {
  transporter = nodemailer.createTransport({
    host: HOST,
    port: PORT,
    auth: {
      user: USER,
      pass: PASSWORD,
    },
  });
};

async function sendMail(options = {}) {
  if (!transporter) {
    init();
  }
  const {
    from = `${SENDER_NAME} <${USER}>`,
    ...rest
  } = options;
  try {
    await transporter.sendMail({ from, ...rest });
  } catch (err) {
    throw err;
  }
};

module.exports = sendMail;
