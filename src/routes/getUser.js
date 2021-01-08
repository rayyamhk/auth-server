const { logger } = require('../utils');
const { getUser: getSingleUser } = require('../utils/Users');

async function getUser(req, res) {
  try {
    const { email } = req.body;

    const {
      statusCode,
      message,
      payload,
    } = await getSingleUser(email);
    logger.info(message);
    return res.status(statusCode).send(payload || message).end();
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = getUser;
