const logger = require('./logger');
const nodemailer = require('nodemailer');

let transporter;

// test accounts generated here https://ethereal.email/
// all email will be catched by ethereal.email
const HOST = 'smtp.ethereal.email',
      PORT = 587,
      USER = 'wyatt.zboncak2@ethereal.email',
      PASSWORD = 'Tga89vPtxZEMB3m5Fw',
      SENDER_NAME = 'Wyatt Zboncak';

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
    to,
    ...rest
  } = options;
  try {
    await transporter.sendMail({ from, to, ...rest });
    logger.info(`Email has been sent to ${to}`);
  } catch (err) {
    throw err;
  }
};

module.exports = sendMail;
