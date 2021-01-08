const { logger } = require('../utils');
const { getUsers: getAllUsers } = require('../utils/Users');

async function getUsers(req, res) {
  try {
    const {
      statusCode,
      message,
      payload,
    } = await getAllUsers(req.query);
    logger.info(message);
    return res.status(statusCode).json(payload).end();
  } catch (err) {
    logger.error(err);
    return res.status(500).send('500 Internal Server Error').end();
  }
};

module.exports = getUsers;
